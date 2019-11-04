package com.aweproject;

import android.app.Application;
import android.content.Context;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.microsoft.codepush.react.CodePush;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.beefe.picker.PickerViewPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import org.devio.rn.splashscreen.SplashScreenReactPackage;

import java.util.Arrays;
import java.util.List;

import javax.annotation.Nullable;

public class MainApplication extends Application implements ReactApplication {
    /**
     * 全局单例，通过{@link #getInstance()}获取。
     */
    private static MainApplication sInstance;
    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new SplashScreenReactPackage(),
                    new RNCWebViewPackage(),
                    new AsyncStoragePackage(),
                    new PickerViewPackage(),
                    new FastImageViewPackage(),

                    new RNGestureHandlerPackage(),
                    new AnExampleReactPackage(),
                    new CodePush(BuildConfig.CODEPUSH_KEY, MainApplication.this, BuildConfig.DEBUG)
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }

        @Nullable
        @Override
        protected String getJSBundleFile() {
            return CodePush.getJSBundleFile();
        }
    };

    /**
     * 获取全局Application单例。
     */
    public static MainApplication getInstance() {
        return sInstance;
    }

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        sInstance = this;
        SoLoader.init(this, /* native exopackage */ false);
        Log.e("MainApplication", "热更新key=  " + BuildConfig.CODEPUSH_KEY);
    }

}
