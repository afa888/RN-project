package wendu.dsbridge.game;


import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.net.http.SslError;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.SslErrorHandler;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.LinearLayout;

import java.lang.ref.WeakReference;

import wendu.dsbridge.CompletionHandler;
import wendu.dsbridge.DWebView;
import wendu.dsbridge.R;

/**
 * 游戏界面 棋牌可以返回不谦容电子
 */
public class GameActivity extends Activity {
    private View view_title_status_bar;
    private DWebView mWebView;
    private String url = "";
    private long mLastBackTime;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main2);
        url = getIntent().getStringExtra("url");
        // url = "https://github.com/";
        mWebView = findViewById(R.id.wv_game);
        initWebView();
        mWebView.loadUrl(url);
    }

    private void initWebView() {
        WebSettings ws = mWebView.getSettings();

        //设置WebView属性，能够执行Javascript脚本
        ws.setJavaScriptEnabled(true);
        // 设置可以支持缩放
        ws.setSupportZoom(true);
        // 设置隐藏缩放工具
        ws.setBuiltInZoomControls(false);
        //扩大比例的缩放
        ws.setUseWideViewPort(true);
        //自适应屏幕
        ws.setLayoutAlgorithm(WebSettings.LayoutAlgorithm.SINGLE_COLUMN);
        ws.setLoadWithOverviewMode(true);
        ws.setDisplayZoomControls(false); //隐藏webview缩放按钮
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            ws.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }
        DWebView.setWebContentsDebuggingEnabled(true);
        mWebView.addJavascriptObject(new JaveJsBridge(this), "echo");
//        ws.setUserAgentString("Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:54.0) Gecko/20100101 Firefox/54.0");
        mWebView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                Log.e("gameWebView", "url" + url);
                if (url.equals("http://no_return/") // ag捕鱼返回时调用
                ) {
                    finish();
                    return true;
                }
                view.getSettings().setCacheMode(WebSettings.LOAD_DEFAULT);
                view.loadUrl(url);
                Log.i("TAG", "User Agent-+:" + view.getSettings().getUserAgentString());
                return super.shouldOverrideUrlLoading(view, url);
            }

            @Override
            public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
                handler.proceed();
            }
        });

        mWebView.setWebChromeClient(new Html5WebView.TXWebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                super.onProgressChanged(view, newProgress);
                if (newProgress >= 100) {
                    hideLoadingDialog();
                } else {
                    showLoadingDialog();
                }
            }
        });
    }

    @Override
    public void onBackPressed() {
        long current = System.currentTimeMillis();
        if (current - mLastBackTime > 2000) {
            mLastBackTime = current;
        } else {
            super.onBackPressed();
        }
    }

    public class JaveJsBridge {
        private WeakReference<Activity> wrf = null;

        public JaveJsBridge(Activity mactivity) {
            wrf = new WeakReference<>(mactivity);
        }

        @SuppressLint("JavascriptInterface")
        @JavascriptInterface
        public void routToCustomerService(Object arg, CompletionHandler<String> callback) {
            if (wrf != null && wrf.get() != null) {
                //  RouterHub.getDefault().sendSelectCsBroadcast();
                wrf.get().finish();
                // Logger.debug("网页点击客服发送广播");
            }
        }

        @SuppressLint("JavascriptInterface")
        @JavascriptInterface
        public void backExitApp(Object arg, CompletionHandler<String> callback) {
            if (wrf != null && wrf.get() != null) {
                wrf.get().finish();
                //  Logger.debug("关闭退出当前activity");
            }
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        hideLoadingDialog();
        if (mWebView != null) {
            mWebView.destroy();
        }
    }

    private LoadingDialog mLoading = null;

    private void showLoadingDialog() {
        if (mLoading == null) {
            mLoading = new LoadingDialog(this);
            mLoading.setCancelable(false);
            mLoading.setCanceledOnTouchOutside(false);
            mLoading.setTitleText("加载中...");
        }
        if (!mLoading.isShowing()) {
            mLoading.show();
        }
    }

    private void hideLoadingDialog() {
        if (mLoading != null && mLoading.isShowing()) {
            mLoading.dismiss();
        }
    }
}
