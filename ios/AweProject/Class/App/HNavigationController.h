//
//  HNavigationController.h
//  HProjectModel1
//
//  Created by txkj_mac on 2018/9/20.
//  Copyright © 2018年 dqf. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface HNavigationController : UINavigationController

- (void)addFullScreenPopBlackListItem:(UIViewController *)viewController;
- (void)removeFromFullScreenPopBlackList:(UIViewController *)viewController;

@end
