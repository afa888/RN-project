//
//  HGameVC.h
//  HProjectModel1
//
//  Created by txkj_mac on 2018/9/30.
//  Copyright © 2018年 dqf. All rights reserved.
//

#import "HViewController.h"
#import "WKWebViewJavascriptBridge.h"

@interface HGameVC : HViewController
@property (nonatomic, copy) NSString *gameType;
@property (nonatomic, copy) NSString *urlString;
@property (nonatomic) BOOL isTXQP;

@end
