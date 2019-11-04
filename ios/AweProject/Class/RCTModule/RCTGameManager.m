//
//  RCTGameManager.m
//  AweProject
//
//  Created by mike on 15/7/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "RCTGameManager.h"
#import "HGameVC.h"
#import "HWebviewVC.h"
#import "HGameViewController.h"
#import "UIApplication+HUtil.h"
#import "HSkinManager.h"

@interface RCTGameManager()<SFSafariViewControllerDelegate>

@end

@implementation RCTGameManager

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(openGameWith:(NSString *)urlStr gameId:(NSString *)gameId gameType:(NSString *)platCode) {

  dispatch_sync(dispatch_get_main_queue(), ^{
    static NSArray *gameVCTypeArr = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
      // BBIN视讯 CG9电子 MG电子 SW电子 PS电子 JDB电子
      // HABA电子 GG捕鱼 AG捕鱼 TGP电子 IM电竞 IG IG新 VR GY
      gameVCTypeArr = @[@"CQJ", @"BBIN", @"MG", @"SW", @"SB"
                        , @"PS", @"JDB", @"HABA", @"GGBY", @"IM",
                        @"IGPJ", @"IG", @"IGPJGFC", @"IGGFC", @"VR", @"GY"];
    });
    
    if (urlStr == nil || [urlStr isEqualToString:@""] || [urlStr isKindOfClass:[NSNull class]]) {
      [self showAlert:@"url为空"];
    }else if ([urlStr isEqualToString:@"error"]) {
      [self showAlert:@"系统错误!"];
    }else if([urlStr isEqualToString:@"process"]) {
      [self showAlert:@"维护中"];
    }else {
      // BBIN电子
      if (([platCode isEqualToString:@"BBIN"] && [gameId isEqualToString:@"2"])) {
        if (iPhoneX) {
          HGameVC *gameVC = HGameVC.new;
          gameVC.urlString = urlStr;
          gameVC.gameType = platCode;
          [UIApplication.navi pushViewController:gameVC
                                        animated:YES];
        } else {
          HWebviewVC *gameVC = HWebviewVC.new;
          gameVC.titleText = @"游戏";
          gameVC.htmlurl = urlStr;
          gameVC.gameType = platCode;
          [UIApplication.navi pushViewController:gameVC
                                        animated:YES];
        }
        //                    [UIApplication openURLString:urlStr];
        // IM体育 AG捕鱼
      } else if (([platCode isEqualToString:@"IM"] && [gameId isEqualToString:@"1"]) || ([platCode isEqualToString:@"AGIN"] && [gameId isEqualToString:@"6"]) || [gameVCTypeArr containsObject:platCode]) {
        HGameVC *gameVC = HGameVC.new;
        gameVC.urlString = urlStr;
        gameVC.gameType = platCode;
        [UIApplication.navi pushViewController:gameVC animated:YES];
      } else if ([platCode isEqualToString:@"TXQP"]) {//天下棋牌
        NSString *urlString = [NSString stringWithString:urlStr];
        urlString = [urlString stringByAppendingString:@"&logintype=4"];
        HGameVC *gameVC = HGameVC.new;
        gameVC.isTXQP = YES;
        gameVC.urlString = urlString;
        gameVC.gameType = platCode;
        [UIApplication.navi pushViewController:gameVC animated:YES];
      } else {
        HGameViewController *sfvc = [[HGameViewController alloc] initWithURL:[NSURL URLWithString:urlStr]];
        sfvc.gameType = platCode;
        sfvc.title = @"游戏";
        [UIApplication.navi pushViewController:sfvc animated:YES];
      }
    }
  });
  
}

RCT_EXPORT_METHOD(getVersion:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  NSString *version = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"];//获取项目版本号
  resolve(version);
}

- (void)showAlert:(NSString *)message {
  UIAlertController *alertController = [UIAlertController alertControllerWithTitle:@"温馨提示" message:message preferredStyle:UIAlertControllerStyleAlert];
  UIAlertAction *action = [UIAlertAction actionWithTitle:@"确定"
                                                   style:UIAlertActionStyleDefault
                                                 handler:nil];
  [alertController addAction:action];
  
  UIViewController *rootController = [UIApplication sharedApplication].delegate.window.rootViewController;
  [rootController presentViewController:alertController animated:YES completion:nil];
}

#pragma mark - SFSafariViewControllerDelegate
- (void)safariViewControllerDidFinish:(SFSafariViewController *)controller {
  [UIApplication sharedApplication].statusBarHidden = NO;
  [controller dismissViewControllerAnimated:YES completion:^{
    
  }];
}

- (void)safariViewController:(SFSafariViewController *)controller didCompleteInitialLoad:(BOOL)didLoadSuccessfully {
//  [(HGameViewController *)controller setDidFinishLaunch:YES];
}
@end
