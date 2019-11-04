//
//  HGameViewController.h
//  HProjectModel1
//
//  Created by txkj_jordan on 2019/4/10.
//  Copyright © 2019年 dqf. All rights reserved.
//

#import <SafariServices/SafariServices.h>
#import "HViewController.h"


NS_ASSUME_NONNULL_BEGIN

@interface HGameViewController : HViewController

@property (nonatomic, copy) NSString *gameType;

- (instancetype)initWithURL:(NSURL *)url;

@end

NS_ASSUME_NONNULL_END
