package com.example.hybridchat;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.os.Build;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.NotificationCompat;

public class MainActivity extends AppCompatActivity {

    private WebView webView;
    private static final String CHANNEL_ID = "chat_notification_channel";
    private static final int NOTIFICATION_ID = 1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // 初始化WebView
        webView = findViewById(R.id.webview);
        
        // 配置WebView设置
        configureWebView();
        
        // 创建通知渠道（Android 8.0及以上需要）
        createNotificationChannel();
        
        // 加载聊天应用页面
        // 注意：请将下面的IP地址替换为您电脑的局域网IP地址
        // 如果在同一台电脑上测试，可以使用10.0.2.2（Android模拟器访问宿主机的特殊IP）
        String serverUrl = "http://10.0.2.2:3000";
        webView.loadUrl(serverUrl);
    }

    private void configureWebView() {
        // 启用JavaScript
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        
        // 启用DOM存储
        webSettings.setDomStorageEnabled(true);
        
        // 设置WebViewClient以处理页面导航
        webView.setWebViewClient(new WebViewClient());
        
        // 添加JavaScript接口，允许网页调用Android原生方法
        webView.addJavascriptInterface(new WebAppInterface(this), "AndroidInterface");
    }

    private void createNotificationChannel() {
        // 创建通知渠道（Android 8.0及以上需要）
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            CharSequence name = "Chat Notifications";
            String description = "Notifications for new chat messages";
            int importance = NotificationManager.IMPORTANCE_DEFAULT;
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, name, importance);
            channel.setDescription(description);
            
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }

    // WebAppInterface类，提供JavaScript可调用的方法
    public class WebAppInterface {
        Context mContext;

        WebAppInterface(Context c) {
            mContext = c;
        }

        // 获取设备信息的方法
        @JavascriptInterface
        public String getDeviceInfo() {
            return android.os.Build.MODEL;
        }

        // 显示通知的方法
        @JavascriptInterface
        public void showNotification(String message) {
            NotificationCompat.Builder builder = new NotificationCompat.Builder(mContext, CHANNEL_ID)
                    .setSmallIcon(R.drawable.ic_notification) // 需要添加通知图标
                    .setContentTitle("新消息")
                    .setContentText(message)
                    .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                    .setAutoCancel(true);

            NotificationManager notificationManager = (NotificationManager) mContext.getSystemService(Context.NOTIFICATION_SERVICE);
            notificationManager.notify(NOTIFICATION_ID, builder.build());
        }
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}