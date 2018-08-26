-- --------------------------------------------------------
-- 主机:                           localhost
-- 服务器版本:                        5.5.53 - MySQL Community Server (GPL)
-- 服务器操作系统:                      Win32
-- HeidiSQL 版本:                  9.5.0.5220
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- 导出  表 dazzling.collection 结构
CREATE TABLE IF NOT EXISTS `collection` (
  `cid` int(11) NOT NULL AUTO_INCREMENT COMMENT '收藏主键',
  `uid` int(11) NOT NULL COMMENT '用户id',
  `wid` int(11) NOT NULL COMMENT '分类id',
  `wname` int(10) NOT NULL COMMENT '分类名',
  `addtime` datetime NOT NULL COMMENT '添加时间',
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0表示正常',
  PRIMARY KEY (`cid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='收藏表';

-- 数据导出被取消选择。
-- 导出  表 dazzling.discuss 结构
CREATE TABLE IF NOT EXISTS `discuss` (
  `did` int(11) NOT NULL AUTO_INCREMENT COMMENT '评论主键',
  `uid` int(11) NOT NULL COMMENT '用户id',
  `username` char(12) NOT NULL COMMENT '用户名谁',
  `dcontent` text NOT NULL COMMENT '评论内容',
  `reply` text NOT NULL COMMENT '回复内容',
  `replytime` datetime NOT NULL COMMENT '回复时间',
  `disstime` datetime NOT NULL COMMENT '评论时间',
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0表示正常',
  PRIMARY KEY (`did`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='评论表';

-- 数据导出被取消选择。
-- 导出  表 dazzling.publish 结构
CREATE TABLE IF NOT EXISTS `publish` (
  `pid` int(11) NOT NULL AUTO_INCREMENT COMMENT '作品发布主键',
  `uid` int(11) NOT NULL COMMENT '用户id',
  `username` char(12) NOT NULL COMMENT '用户名谁',
  `wid` int(11) NOT NULL COMMENT '分类id',
  `wname` char(10) NOT NULL COMMENT '分类名',
  `description` text NOT NULL COMMENT '作品描述',
  `imglist` varchar(10000) NOT NULL COMMENT '上传多个图片',
  `addtime` datetime NOT NULL COMMENT '添加时间',
  `collectnums` bigint(250) NOT NULL COMMENT '收藏次数',
  `disscusnums` bigint(250) NOT NULL COMMENT '评论次数',
  `zannums` bigint(250) NOT NULL COMMENT '点赞次数',
  `keywords` char(100) NOT NULL COMMENT '关键词',
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0表示正常',
  PRIMARY KEY (`pid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='用户作品发布表';

-- 数据导出被取消选择。
-- 导出  表 dazzling.workclass 结构
CREATE TABLE IF NOT EXISTS `workclass` (
  `wid` int(11) NOT NULL AUTO_INCREMENT COMMENT '分类主键',
  `uid` int(11) NOT NULL COMMENT '用户id',
  `username` char(12) NOT NULL COMMENT '用户谁',
  `wname` char(10) NOT NULL COMMENT '分类名',
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0表示正常',
  PRIMARY KEY (`wid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='精选作品分类表';

-- 数据导出被取消选择。
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
collection