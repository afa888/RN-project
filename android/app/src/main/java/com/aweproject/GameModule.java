package com.aweproject;

import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.util.Log;
import android.widget.Toast;

import com.aweproject.apkupdata.ApkDownInstall;
import com.aweproject.apkupdata.OnUpdateListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.text.DecimalFormat;
import java.util.Map;
import java.util.HashMap;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;


import wendu.dsbridge.game.GameActivity;
import wendu.dsbridge.game.GameHActivity;

import static com.facebook.react.bridge.UiThreadUtil.runOnUiThread;

public class GameModule extends ReactContextBaseJavaModule {

    private static final String DURATION_SHORT_KEY = "SHORT";
    private static final String DURATION_LONG_KEY = "LONG";
    private ReactApplicationContext reactContext;

    public GameModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Nonnull
    @Override
    public String getName() {
        return "GameManager";
    }

    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT);
        constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG);
        return constants;
    }

    @ReactMethod
    public void getVersion(Promise promise) {
        int versioncode = 0;
        try {
            // ---get the package info---
            PackageManager pm = reactContext.getPackageManager();
            PackageInfo pi = pm.getPackageInfo(reactContext.getPackageName(), 0);
            // versionName = pi.versionName;
            versioncode = pi.versionCode;
            promise.resolve(versioncode);
        } catch (Exception e) {
            Log.e("VersionInfo", "获取版本信息失败 Exception", e);
        }

    }

    @ReactMethod
    public void openGameWith(String url, String id, String type) {
        Intent intent;
        Log.e("webview", "type=" + type);
        if (type.equals("HABA") || type.equals("PS") || type.equals("MG")|| type.equals("BBIN")) {
            intent = new Intent(getCurrentActivity(), GameHActivity.class);

        } else {
            intent = new Intent(getCurrentActivity(), GameActivity.class);
        }
        intent.putExtra("url", url);
        intent.putExtra("gameType", type);
        intent.putExtra("gameId", id);
        Log.e("webview", "url=" + url);
        getCurrentActivity().startActivity(intent);
    }

    @ReactMethod
    public void startCheckVersion(String url, Promise promise) {
        ApkDownInstall down = new ApkDownInstall(url);
        down.checkVersionUpdate(new OnUpdateListener() {

            @Override
            public void onUpdate() {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        down.updateByApkOrPatch(new OnUpdateListener() {

                            @Override
                            public void onUpdate() {

                            }

                            @Override
                            public void onCancelUpdate() {
                                promise.resolve("下载出错了");
                            }

                            @Override
                            public void onProgress(float progress) {
                                // promise.resolve("进度"+progress);

                                sendProgress(Float.parseFloat(roundByScale(progress, 2)));
                                Log.e("progress", Float.parseFloat(roundByScale(progress, 2)) + "");
                            }
                        });
                    }
                });
            }

            @Override
            public void onCancelUpdate() {
                promise.resolve("下载出错了");
                //TODO 直接跳转
            }

            @Override
            public void onProgress(float progress) {

            }
        });
    }

    //定义发送事件的函数
    public void sendEvent(String eventName, @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    public void sendProgress(float progress) {
        //在该方法中开启线程，并且延迟3秒，然后向JavaScript端发送事件。
        new Thread(new Runnable() {
            @Override
            public void run() {
                //发送事件,事件名为EventName
                WritableMap et = Arguments.createMap();
                et.putString("progress", progress + "");
                sendEvent("EventName", et);
            }
        }).start();

    }

    /**
     * 将double格式化为指定小数位的String，不足小数位用0补全
     *
     * @param v     需要格式化的数字
     * @param scale 小数点后保留几位
     * @return
     */
    private String roundByScale(float v, int scale) {
        if (scale < 0) {
            throw new IllegalArgumentException(
                    "The   scale   must   be   a   positive   integer   or   zero");
        }
        if (scale == 0) {
            return new DecimalFormat("0").format(v);
        }
        String formatStr = "0.";
        for (int i = 0; i < scale; i++) {
            formatStr = formatStr + "0";
        }
        return new DecimalFormat(formatStr).format(v);


    }
}