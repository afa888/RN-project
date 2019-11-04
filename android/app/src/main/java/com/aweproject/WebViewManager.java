package com.aweproject;

import android.annotation.SuppressLint;
import android.net.http.SslError;
import android.os.Build;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.SslErrorHandler;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.Map;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

import wendu.dsbridge.CompletionHandler;
import wendu.dsbridge.DWebView;


/**
 * 自定义的webview用在rn中的控件
 */
public class WebViewManager extends SimpleViewManager<DWebView> {
    public static final String REACT_VIEW = "WebView";
    private static final int COMMAND_HELLO_ID = 1;
    private static final String COMMAND_HELLO_NAME = "destry";
    DWebView mWebView;

    /**
     * @return 返回的名字会用于在JavaScript端引用这个原生视图类型。
     */
    @Override
    public String getName() {
        return REACT_VIEW;
    }

    /**
     * 创建视图，且应当把自己初始化为默认的状态。所有属性的设置都通过后续的updateView来进行。
     */
    @Override
    public DWebView createViewInstance(ThemedReactContext reactContext) {
        mWebView = new DWebView(reactContext);
     /*   DisplayMetrics dm2 = reactContext.getResources().getDisplayMetrics();


        RelativeLayout.LayoutParams params = (RelativeLayout.LayoutParams) mWebView.getLayoutParams();
        params.width = dm2.widthPixels;
        params.height = dm2.heightPixels;
        mWebView.setLayoutParams(params);*/

        initWebView(mWebView);

        return mWebView;
    }


    @ReactProp(name = "url")
    public void setUrl(DWebView view, String url) {
        view.loadUrl(url);
    }

    /*原生js调用原生*/
    @Nullable
    @Override
    public Map<String, Integer> getCommandsMap() {
        return MapBuilder.of(
                COMMAND_HELLO_NAME, COMMAND_HELLO_ID
                //更多可以继续在后面追加
                //  ,COMMAND_?_NAME,COMMAND_?_ID
        );
    }

    /*原生js调用原生*/
    @Override
    public void receiveCommand(@Nonnull DWebView root, int commandId, @Nullable ReadableArray args) {
        switch (commandId) {
            case COMMAND_HELLO_ID:
                if (args != null) {
                    String name = args.getString(0);//获取第一个位置的数据
                    Log.e("Webview", "receiveCommand=" + name);
                    mWebView.destroy();
                }
                break;
            default:
                break;
        }
    }

    /*原生ui组件传递消息给js*/
    @Nullable
    @Override
    public Map getExportedCustomBubblingEventTypeConstants() {
        return MapBuilder.builder()
                .put(
                        "topChange",
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of("bubbled", "onChange")))
                .build();
    }

    private void initWebView(DWebView mWebView) {
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
        mWebView.addJavascriptObject(new JaveJsBridge(), "echo");
        mWebView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                /*if (url.startsWith(BaseConstants.SERVER_ADDR)) {
                    finish();
                    return true;
                }*/
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

      /*  mWebView.setWebChromeClient(new Html5WebView.TXWebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                super.onProgressChanged(view, newProgress);
                Log.e("webView", newProgress + "");
                WritableMap event = Arguments.createMap();
                event.putString("message", "" + newProgress);
                ReactContext reactContext = (ReactContext) mWebView.getContext();
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                        mWebView.getId(),
                        "topChange",
                        event);
            }
        });*/
    }

    public class JaveJsBridge {

        public JaveJsBridge() {
        }

        @SuppressLint("JavascriptInterface")
        @JavascriptInterface
        public void routToCustomerService(Object arg, CompletionHandler<String> callback) {
           /* if (wrf != null && wrf.get() != null) {
                //  RouterHub.getDefault().sendSelectCsBroadcast();
                wrf.get().finish();
                // Logger.debug("网页点击客服发送广播");
            }*/
        }

        @SuppressLint("JavascriptInterface")
        @JavascriptInterface
        public void backExitApp(Object arg, CompletionHandler<String> callback) {
           /* if (wrf != null && wrf.get() != null) {
                wrf.get().finish();
                //  Logger.debug("关闭退出当前activity");
            }*/
        }
    }

}

