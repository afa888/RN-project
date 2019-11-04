//
//  HSFSafariViewController.h
//  HProjectModel1
//
//  Created by TX-Kevin on 2019/4/29.
//  Copyright © 2019年 dqf. All rights reserved.
//

#import <SafariServices/SafariServices.h>

NS_ASSUME_NONNULL_BEGIN

@interface HSFSafariViewController : SFSafariViewController
- (void)loadURL:(NSURL *)URL;
@end

NS_ASSUME_NONNULL_END
