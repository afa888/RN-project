package com.aweproject.apkupdata;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.os.PowerManager;
import android.support.v4.content.FileProvider;
import android.util.Log;

import com.aweproject.BuildConfig;
import com.aweproject.MainApplication;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.concurrent.TimeUnit;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.ResponseBody;

import static android.content.Intent.FLAG_GRANT_WRITE_URI_PERMISSION;
import static com.facebook.react.bridge.UiThreadUtil.runOnUiThread;

public class ApkDownInstall {
    private String URL_DOWNLOAD_UPDATE_JSON = "https://www.openl.cn/aas/apk.json";
    private String downloadUrl = "";
    /**
     * 存储的权限。
     */
    private final String[] PERMISSIONS_STORAGE = {
            Manifest.permission.WRITE_EXTERNAL_STORAGE
    };
    private final int REQUEST_CODE_EXTERNAL_STORAGE = 0x01;

    public ApkDownInstall(String downloadUrl) {
        this.downloadUrl = downloadUrl;
    }


    /**
     * 检测版本更新。
     *
     * @param listener 更新监听器
     */
    public void checkVersionUpdate(final OnUpdateListener listener) {
        performUpdate(listener);

    }


    /**
     * 执行更新，到这一步还不区分补丁更新和安装包更新。
     *
     * @param listener 更新监听器
     */
    private void performUpdate(final OnUpdateListener listener) {
        try {
            final Request request = new Request.Builder()
                    .url(downloadUrl)
                    .addHeader("Accept-Encoding", "identity")
                    .build();
            OkHttpClient client = new OkHttpClient.Builder()
                    .connectTimeout(3, TimeUnit.SECONDS)
                    .readTimeout(10, TimeUnit.SECONDS)
                    .build();
            Call call = client.newCall(request);
            call.enqueue(new Callback() {
                @Override
                public void onFailure(Call call, IOException e) {
                    listener.onCancelUpdate();
                }

                @Override
                public void onResponse(Call call, Response response) {
                    if (response == null) {
                        listener.onCancelUpdate();
                        return;
                    }
                    ResponseBody body = response.body();
                    if (body == null) {
                        listener.onCancelUpdate();
                        return;
                    }
                    long size = body.contentLength();
                    if (size != -1) {
                        UpdateFile updateFile = new UpdateFile(false, downloadUrl, size);

                        listener.onUpdate();
                    } else {
                        listener.onCancelUpdate();
                    }
                }
            });
        } catch (Exception e) {
            listener.onCancelUpdate();
        }
    }

    public void updateByApkOrPatch(final OnUpdateListener listener) {
        try {
            //pb_splash_download_update.setText("等待下载...");
            //文件保存的目录
            String FOLDER_APP_ROOT = Environment.getExternalStorageDirectory().getAbsolutePath() + File.separator + BuildConfig.FLAVOR.toUpperCase();
            final String dir = FOLDER_APP_ROOT + File.separator + "apk";
            if (!new File(dir).exists()) {
                new File(dir).mkdirs();
            }
            //文件名称
            final String filename = "update.apk";
            new Thread(new Runnable() {
                @Override
                public void run() {
                    Log.e("DownloadUpdateDialog", "开始下载");
                    PowerManager powerManager = (PowerManager) MainApplication.getInstance().getApplicationContext().getSystemService(Context.POWER_SERVICE);
                    int flags = PowerManager.SCREEN_BRIGHT_WAKE_LOCK;

                    @SuppressLint("InvalidWakeLockTag") PowerManager.WakeLock wakeLock = powerManager.newWakeLock(flags, "flag_download_update_file");

                    wakeLock.acquire();

                    DownloadUtils.download(downloadUrl, dir, filename, new OnDownloadListener() {
                        @Override
                        public void onDownloadSuccess(final File file) {
                            if (wakeLock.isHeld()) {
                                wakeLock.release();
                            }
                            Log.e("DownloadUpdateDialog", "成功下载" + file.toString());
                            // 等待安装
                            listener.onProgress(100);
                            install(MainApplication.getInstance().getApplicationContext(), file);

                        }

                        @Override
                        public void onDownloadProgress(final float progress) {
                            listener.onProgress(progress);
                            Log.e("DownloadUpdateDialog", "进度" + progress);
                        }

                        @Override
                        public void onDownloadFailure(final Exception e) {
                            if (wakeLock.isHeld()) {
                                wakeLock.release();
                            }
                            listener.onCancelUpdate();
                            Log.e("DownloadUpdateDialog", "下载失败" + e.toString());
                        }
                    });
                }
            }).start();
        } catch (Exception e) {
            // pb_splash_download_update.setText("下载失败" + e.getMessage());
        }
    }

    /**
     * 安装apk文件。
     *
     * @param apkFile apk文件的路径
     */
    private void install(Context context, File apkFile) {
        Log.e("DownloadUpdateDialog", "安装apk");
        Intent intent = new Intent();
        intent.setAction(Intent.ACTION_VIEW);
        Uri contentUri;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            intent.setFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            contentUri = FileProvider.getUriForFile(context,
                    MainApplication.getInstance().getPackageName() + ".fileprovider", apkFile);
        } else {
            contentUri = Uri.fromFile(apkFile);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        }
        intent.setDataAndType(contentUri, "application/vnd.android.package-archive");
        context.startActivity(intent);
        android.os.Process.killProcess(android.os.Process.myPid());
    }

//    /**
//     * 安装apk文件。
//     *
//     * @param apkFile apk文件的路径
//     */
//    private void install(Context context, File apkFile) {
//        try{
//            Intent intent = new Intent();
//            intent.setAction(Intent.ACTION_VIEW);
//
//            Uri contentUri;
//            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
//                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
//
//                contentUri = FileProvider.getUriForFile(context,
//                        getPackageName() + ".fileprovider", apkFile);
//                intent.setDataAndType(contentUri, "application/vnd.android.package-archive");
//                //查询所有符合 intent 跳转目标应用类型的应用
//                List<ResolveInfo> resInfoList = getPackageManager().queryIntentActivities(intent, PackageManager.MATCH_DEFAULT_ONLY);
//                //然后全部授权
//                for(ResolveInfo resolveInfo : resInfoList){
//                    String packageName = resolveInfo.activityInfo.packageName;
//                    grantUriPermission(packageName,contentUri,FLAG_GRANT_WRITE_URI_PERMISSION);
//                    grantUriPermission(packageName, contentUri, Intent.FLAG_GRANT_READ_URI_PERMISSION);
//                }
//            } else {
//                contentUri = Uri.fromFile(apkFile);
//                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
//                intent.setDataAndType(contentUri, "application/vnd.android.package-archive");
//            }
//            context.startActivity(intent);
//            TXApp.getInstance().forceClose();
//            android.os.Process.killProcess(android.os.Process.myPid());
//        }catch (Exception e){
//            Log.i("pei","install exception:" + e.toString());
//        }
//
//    }
}
