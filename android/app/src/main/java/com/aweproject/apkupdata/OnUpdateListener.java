package com.aweproject.apkupdata;

import android.content.Context;

public interface OnUpdateListener {

    void onUpdate();

    void onCancelUpdate();
    void onProgress(float progress);
}
