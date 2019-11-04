//
//  UIDevice+HUtil.h
//  HProj
//
//  Created by dqf on 2017/11/8.
//  Copyright © 2017年 dqfStudio. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface UIDevice (HUtil)

/// 判断设备是否为iPad/iPad mini.
@property (nonatomic, readonly) BOOL isPad;

/// 判断设备是否为模拟器
@property (nonatomic, readonly) BOOL isSimulator;

/// 判断设备是否能打电话
@property (nonatomic, readonly) BOOL canMakePhoneCalls NS_EXTENSION_UNAVAILABLE_IOS("");

/// 设备型号，例如："iPhone6,1" "iPad4,6"
/// @see http://theiphonewiki.com/wiki/Models
@property (nonatomic, readonly) NSString * _Nonnull machineModel;

/// 设备型号名称，例如："iPhone 5s" "iPad mini 2"
/// @see http://theiphonewiki.com/wiki/Models
@property (nonatomic, readonly) NSString * _Nonnull machineModelName;

#pragma mark - Disk Space

/// 总的存储空间
@property (nonatomic, readonly) int64_t diskSpace;

/// 空余存储空间
@property (nonatomic, readonly) int64_t diskSpaceFree;

/// 已使用的存储空间
@property (nonatomic, readonly) int64_t diskSpaceUsed;

/// 获取wifi下的ip地址 @"192.168.1.111"
@property (nullable, nonatomic, readonly) NSString *ipAddressWIFI;

/// 获取ip地址 @"10.2.2.222"
@property (nullable, nonatomic, readonly) NSString *ipAddressCell;

@end

