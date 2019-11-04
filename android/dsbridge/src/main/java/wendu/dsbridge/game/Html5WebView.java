package wendu.dsbridge.game;

import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.http.SslError;
import android.os.Build;
import android.os.Message;
import android.text.TextUtils;
import android.util.AttributeSet;
import android.util.Log;
import android.view.KeyEvent;
import android.webkit.CookieManager;
import android.webkit.GeolocationPermissions;
import android.webkit.JavascriptInterface;
import android.webkit.SslErrorHandler;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import org.json.JSONArray;
import org.json.JSONException;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

public class Html5WebView extends WebView {

    private Context mContext;
    private JSONArray jsonArr = null;

    public Html5WebView(Context context) {
        this(context, null);
    }

    public Html5WebView(Context context, AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public Html5WebView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        mContext = context;
        init();
    }

    /**
     * 遵循《Effective Java 第二版》一书中第22条:优先考虑静态成员类。
     */
    public static class TXWebChromeClient extends WebChromeClient {

        //=========HTML5定位==========================================================
        //需要先加入权限
        //<uses-permission android:name="android.permission.INTERNET"/>
        //<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
        //<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
        @Override
        public void onReceivedIcon(WebView view, Bitmap icon) {
            super.onReceivedIcon(view, icon);
        }

        @Override
        public void onGeolocationPermissionsHidePrompt() {
            super.onGeolocationPermissionsHidePrompt();
        }

        @Override
        public void onGeolocationPermissionsShowPrompt(final String origin, final GeolocationPermissions.Callback callback) {
            callback.invoke(origin, true, false);//注意个函数，第二个参数就是是否同意定位权限，第三个是是否希望内核记住
            super.onGeolocationPermissionsShowPrompt(origin, callback);
        }
        //=========HTML5定位==========================================================


        //=========多窗口的问题==========================================================
        @Override
        public boolean onCreateWindow(WebView view, boolean isDialog, boolean isUserGesture, Message resultMsg) {
            WebViewTransport transport = (WebViewTransport) resultMsg.obj;
            transport.setWebView(view);
            resultMsg.sendToTarget();
            return true;
        }

        @Override
        public void onProgressChanged(WebView view, int newProgress) {
            if (newProgress == 30) {
            }
            if (newProgress == 100) {
                // 网页加载完成
                Log.d("onprogress:", "..." + newProgress);
//                popupdialog.dismiss();
//                getSettings().setBlockNetworkImage(false);
            } else {
                // 网页加载中
//                popupdialog.show();
            }
        }
    }

    private void init() {
        WebSettings mWebSettings = getSettings();
        mWebSettings.setSupportZoom(true);
//        mWebSettings.setLoadWithOverviewMode(true);
        mWebSettings.setUseWideViewPort(true);
        mWebSettings.setDefaultTextEncodingName("utf-8");
        mWebSettings.setLoadsImagesAutomatically(true);
        mWebSettings.setAllowFileAccess(true);
        //开启硬件加速
//        mWebSettings.setRenderPriority(WebSettings.RenderPriority.HIGH);
//        mWebSettings.setBlockNetworkImage(true);
        mWebSettings.setTextZoom(100);  //不随系统改变字体

        //调用JS方法.安卓版本大于17,加上注解 @JavascriptInterface
        mWebSettings.setJavaScriptEnabled(true);
        mWebSettings.setAllowFileAccessFromFileURLs(true);
        mWebSettings.setSupportMultipleWindows(false);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            mWebSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }
        //缓存数据
        saveData(mWebSettings);
        newWindow(mWebSettings);
        setWebChromeClient(new TXWebChromeClient());
        setWebViewClient(webViewClient);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            CookieManager cookieManager = CookieManager.getInstance();
            cookieManager.setAcceptThirdPartyCookies(this, true);
        }
    }

    private class JSObject {

        @JavascriptInterface
        // sdk17版本以上加上注解
        public String getData(String txt) {
            return "12345678";
        }
    }

    /**
     * 多窗口的问题
     */
    private void newWindow(WebSettings mWebSettings) {
        //html中的_bank标签就是新建窗口打开，有时会打不开，需要加以下
        //然后 复写 WebChromeClient的onCreateWindow方法
        mWebSettings.setSupportMultipleWindows(false);
        mWebSettings.setJavaScriptCanOpenWindowsAutomatically(true);
    }

    /**
     * HTML5数据存储
     */
    private void saveData(WebSettings mWebSettings) {
        //有时候网页需要自己保存一些关键数据,Android WebView 需要自己设置
            mWebSettings.setCacheMode(WebSettings.LOAD_NO_CACHE);//没网，则从本地获取，即离线加载

        File cacheDir = mContext.getCacheDir();
        if (cacheDir != null) {
            String appCachePath = cacheDir.getAbsolutePath();
            mWebSettings.setDomStorageEnabled(true);
            mWebSettings.setDatabaseEnabled(true);
            mWebSettings.setAppCacheEnabled(false);
            mWebSettings.setAppCachePath(appCachePath);
        }
    }

//    private void initCookies(){
//        SharedPreferences spf = mContext.getSharedPreferences("Cookie", Client.MODE_PRIVATE);
//        CookieSyncManager.createInstance(mContext);
//        CookieManager cookieManager = CookieManager.getInstance();
//        String cookieString = spf.getString("cookieString", "");
//        cookieManager.setCookie(getUrl(), cookieString);
//        CookieSyncManager.getInstance().sync();
//    }

//    private void syncCookie(String url) {
//        try {
//            CookieSyncManager.createInstance(getContext());
//            CookieManager cookieManager = CookieManager.getInstance();
//            Cookie sessionCookie = appManager.getAppCookie();
//            if (sessionCookie != null) {
//                //这里为什么要加这种格式，去看下cookie格式就知道了
//                String cookieString = sessionCookie.getName() + "=" + sessionCookie.getValue() + "; domain=" + sessionCookie.getDomain();
//                cookieManager.setCookie(url, cookieString);
//                CookieSyncManager.getInstance().sync();
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//    }

    public void setPayUrl(JSONArray arr) {
        if (arr != null)
            jsonArr = arr;
    }

    public boolean parseScheme(String url) {
//        || url.contains("theworldpt.com")
        return url.contains("platformapi/startapp") || (Build.VERSION.SDK_INT > Build.VERSION_CODES.M) && (url.contains("platformapi") && url.contains("startapp"));
    }

    WebViewClient webViewClient = new WebViewClient() {

        @Override
        public boolean shouldOverrideKeyEvent(WebView view, KeyEvent event) {
            return false;
        }

        /**
         * 多页面在同一个WebView中打开，就是不新建activity或者调用系统浏览器打开
         */


//        @Override
//        public boolean shouldOverrideUrlLoading(WebView view, String url) {
////            view.loadUrl(url);
//            Log.d("Url:", url);
////            return true;
//            // 如下方案可在非微信内部WebView的H5页面中调出微信支付
//            if (url.startsWith("https") || url.contains("weixin") || url.contains("qq")) {
//                Intent intent = new Intent();
//                intent.setAction(Intent.ACTION_VIEW);
//                intent.setData(Uri.parse(url));
//                mContext.startActivity(intent);
//                return true;
//            } else if (parseScheme(url)) {
//                try {
//                    Intent intent;
//                    intent = Intent.parseUri(url,
//                            Intent.URI_INTENT_SCHEME);
//                    intent.addCategory("android.intent.category.BROWSABLE");
//                    intent.setComponent(null);
//                    // intent.setSelector(null);
//                    mContext.startActivity(intent);
//                } catch (Exception e) {
//                    e.printStackTrace();
//                }
//            } else {
//                view.loadUrl(url);
//            }
////            return super.shouldOverrideUrlLoading(view,url);
//            return true;
//        }
        @Override
        public void onPageStarted(WebView view, String url, Bitmap favicon) {
//            initCookies();
            super.onPageStarted(view, url, favicon);
        }

        public boolean pay(String url) {
            if (!"".equals(url)) {
                if (jsonArr == null)
                    return false;
                for (int i = 0; i < jsonArr.length(); i++) {
                    try {
                        String temp = (String) jsonArr.get(i);
                        if (url.contains(temp))
                            return true;
                    } catch (JSONException e) {
                        Log.d("aaa", e.getMessage());
                    }
                }
            }
            return false;
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            Log.d("Url:", url);
            WebView.HitTestResult hitTestResult = view.getHitTestResult();
            if (!TextUtils.isEmpty(url) && hitTestResult == null) {
                view.loadUrl(url);
                return true;
            }
            // 如下方案可在非微信内部WebView的H5页面中调出微信支付
            if (url.startsWith("weixin://wap/pay?")
                    || url.startsWith("alipay://")
                    || url.startsWith("alipays://")
                    || url.startsWith("mqqapi://")
                    || url.startsWith("mqqwpa://im")) {
//                Intent intent = new Intent();
//                intent.setAction(Intent.ACTION_VIEW);
//                intent.setData(Uri.parse(url));
                try {
                    Intent intent = Intent.parseUri(url, Intent.URI_INTENT_SCHEME);
                    intent.addCategory(Intent.CATEGORY_BROWSABLE);
                    mContext.startActivity(intent);
                } catch (Exception e) {
                }
                return true;
            } else if (parseScheme(url)) {
                try {
                    Intent intent;
                    intent = Intent.parseUri(url,
                            Intent.URI_INTENT_SCHEME);
                    intent.addCategory("android.intent.category.BROWSABLE");
                    intent.setComponent(null);
                    // intent.setSelector(null);
                    mContext.startActivity(intent);
                    return true;
                } catch (Exception e) {
                    e.printStackTrace();
                }
            } else {
                view.loadUrl(url);
            }
            return super.shouldOverrideUrlLoading(view, url);
        }

        @Override
        public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
            handler.proceed();
        }

        @Override
        public void onLoadResource(WebView view, String url) {
            Log.d("resource", "加载资源--" + url);
            super.onLoadResource(view, url);
        }

        @Override
        public void onPageFinished(WebView view, String url) {
            String removeJs = "var child = document.getElementsByClassName('TopHeader')[0];"
                    + "child.parentNode.removeChild(child);";
            String checkJs = "document.getElementsByClassName('G_Tad_text')[0].click();";
            view.loadUrl("javascript:" + removeJs);
            view.loadUrl("javascript:" + checkJs);
            getSettings().setBlockNetworkImage(false);
            //判断webview是否加载了，图片资源
            if (!getSettings().getLoadsImagesAutomatically()) {
                //设置wenView加载图片资源
                getSettings().setLoadsImagesAutomatically(true);
            }
        }

        @Override
        public void onReceivedError(WebView view, int errorCode,
                                    String description, String failingUrl) {
            //        Logger.debug("errorCode=" + errorCode + ";description=" + description + ";failingUrl=" + failingUrl);
//            view.loadUrl("file:///html/error_page.html");
            view.loadUrl("file:///android_asset/html/error_page.html");
            super.onReceivedError(view, errorCode, description, failingUrl);
        }

//        @Override
//        public WebResourceResponse shouldInterceptRequest(WebView view, String url)
//        {
//            if (url.contains("[tag]"))
//            {
//                String localPath = url.replaceFirst("^http.*[tag]\\]", "");
//                try
//                {
//                    InputStream is = mContext.getAssets().open(localPath);
//                    Log.d(TAG, "shouldInterceptRequest: localPath " + localPath);
//                    String mimeType = "text/javascript";
//                    if (localPath.endsWith("css"))
//                    {
//                        mimeType = "text/css";
//                    }
//                    return new WebResourceResponse(mimeType, "UTF-8", is);
//                }
//                catch (Exception e)
//                {
//                    e.printStackTrace();
//                    return null;
//                }
//            }
//            else
//            {
//                return null;
//            }
//
//        }
    };

    private String readFile(String filePath) {
        try {
            FileInputStream is = new FileInputStream(filePath);
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            byte[] buffer = new byte[4096];
            int len;
            while ((len = is.read(buffer)) != -1) {
                baos.write(buffer, 0, len);
            }
            byte[] data = baos.toByteArray();
            return new String(data, "utf-8");
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}
