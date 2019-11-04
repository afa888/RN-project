package wendu.dsbridge.game;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.net.http.SslError;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.webkit.SslErrorHandler;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ImageView;
import android.widget.LinearLayout;



import java.util.Timer;
import java.util.TimerTask;

import wendu.dsbridge.R;


/**
 * 游戏界面 兼容电子
 */
public class GameHActivity extends Activity implements View.OnClickListener {

    private static final String URL = "url";
    private static final String GAME_TYPE = "gameType";
    private static final String GAME_ID = "gameId";
    private Timer timer;

    public static Intent initData(Context context, String url, String gameType, String gameId) {
        Intent intent = new Intent(context, GameActivity.class);
        intent.putExtra(URL, url);
        intent.putExtra(GAME_TYPE, gameType);
        intent.putExtra(GAME_ID, gameId);
        return intent;
    }
    private Html5WebView mWebView;

    private long mLastBackTime;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_gameh);
        mWebView = findViewById(R.id.wv_game);
        initWebView();
        Intent intent = getIntent();
        String url = intent.getStringExtra(URL);
        String gameType = intent.getStringExtra(GAME_TYPE);
        String gameId = intent.getStringExtra(GAME_ID);
        setOrientationByGame(gameType, gameId);
        Log.i("TAG", "User AgentUrl-:" + url);
        mWebView.loadUrl(url);
        timer = new Timer();
    }

    private void setOrientationByGame(String gameType, String gameId) {
        if (isCagayan88(gameType, gameId)) {
            setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        }
    }

    private boolean isCagayan88(String gameType, String gameId) {
        return "CG".equals(gameType) && "".equals(gameId);
    }

    private void initWebView() {
        WebSettings ws = mWebView.getSettings();
        ws.setJavaScriptEnabled(true);
        ws.setDisplayZoomControls(false);
        ws.setUseWideViewPort(true);
        ws.setLoadWithOverviewMode(true);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            ws.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }
        // 获取到UserAgentString
        String userAgent = ws.getUserAgentString();
        // 打印结果
        Log.i("TAG", "User Agent:" + userAgent);
        mWebView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
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
    }

    @Override
    public void onBackPressed() {
        long current = System.currentTimeMillis();
        if (current - mLastBackTime > 2000) {
         // ToastUtils.showShort(this, "再按一次退出游戏");
            mLastBackTime = current;
        } else {
            super.onBackPressed();
        }
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {

        }
    }



    @Override
    protected void onDestroy() {
        super.onDestroy();
        mWebView.destroy();
        timer.cancel();
    }
}
