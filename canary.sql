/*
 Navicat Premium Data Transfer

 Source Server         : MysqlTest
 Source Server Type    : MySQL
 Source Server Version : 80026
 Source Host           : localhost:3306
 Source Schema         : canary

 Target Server Type    : MySQL
 Target Server Version : 80026
 File Encoding         : 65001

 Date: 07/10/2022 21:00:24
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for attack_method_config
-- ----------------------------
DROP TABLE IF EXISTS `attack_method_config`;
CREATE TABLE `attack_method_config` (
  `attack_method_config_id` int NOT NULL AUTO_INCREMENT,
  `attack_method_provider_id` int DEFAULT NULL,
  `config_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `config_desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `config_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `create_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `is_disabled` tinyint(3) unsigned zerofill DEFAULT NULL,
  PRIMARY KEY (`attack_method_config_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of attack_method_config
-- ----------------------------
BEGIN;
INSERT INTO `attack_method_config` (`attack_method_config_id`, `attack_method_provider_id`, `config_name`, `config_desc`, `config_json`, `create_user`, `create_time`, `is_disabled`) VALUES (1, 1, '配置A', '用于ImageNet数据集的配置', '{\"n_classes\":1000,\"lr\":0.005,\"confidence\":0,\"clip_min\":-3,\"clip_max\":3,\"initial_const\":0.01,\"binary_search_steps\":5,\"max_iterations\":1000,\"attack_type\":\"UNTARGETED\",\"tlabel\":null}', 'admin', '2022-08-07 22:29:00', 000);
INSERT INTO `attack_method_config` (`attack_method_config_id`, `attack_method_provider_id`, `config_name`, `config_desc`, `config_json`, `create_user`, `create_time`, `is_disabled`) VALUES (2, 1, '测试1', '测试1', '{}', 'admin', '2022-08-08 07:59:45', 000);
INSERT INTO `attack_method_config` (`attack_method_config_id`, `attack_method_provider_id`, `config_name`, `config_desc`, `config_json`, `create_user`, `create_time`, `is_disabled`) VALUES (3, 1, '测试2', '测试2', '{}', 'admin', '2022-08-08 08:00:19', 000);
INSERT INTO `attack_method_config` (`attack_method_config_id`, `attack_method_provider_id`, `config_name`, `config_desc`, `config_json`, `create_user`, `create_time`, `is_disabled`) VALUES (4, 1, '测试3', '测试3', '{}', 'admin', '2022-08-08 08:00:36', 000);
INSERT INTO `attack_method_config` (`attack_method_config_id`, `attack_method_provider_id`, `config_name`, `config_desc`, `config_json`, `create_user`, `create_time`, `is_disabled`) VALUES (5, 1, '测试4', '测试4', '{}', 'admin', '2022-08-08 08:09:59', 000);
COMMIT;

-- ----------------------------
-- Table structure for attack_method_info
-- ----------------------------
DROP TABLE IF EXISTS `attack_method_info`;
CREATE TABLE `attack_method_info` (
  `attack_method_id` int NOT NULL AUTO_INCREMENT,
  `attack_method_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `attack_method_desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `attack_method_details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `attack_method_paper` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `attack_method_paper_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `attack_method_type` int DEFAULT NULL,
  `create_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `is_disabled` tinyint DEFAULT '0',
  PRIMARY KEY (`attack_method_id`) USING BTREE,
  KEY `model_type` (`attack_method_type`) USING BTREE,
  KEY `create_user` (`create_user`) USING BTREE,
  CONSTRAINT `attack_method_info_ibfk_1` FOREIGN KEY (`attack_method_type`) REFERENCES `attack_method_type` (`attack_method_type_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `attack_method_info_ibfk_2` FOREIGN KEY (`create_user`) REFERENCES `user_info` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=314 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of attack_method_info
-- ----------------------------
BEGIN;
INSERT INTO `attack_method_info` (`attack_method_id`, `attack_method_name`, `attack_method_desc`, `attack_method_details`, `attack_method_paper`, `attack_method_paper_url`, `attack_method_type`, `create_user`, `create_time`, `is_disabled`) VALUES (1, 'L-BFGS', '', '', 'Intriguing properties of neural networks', 'https://arxiv.org/pdf/1312.6199.pdf', 1, 'admin', '2022-10-04 10:28:34', 0);
INSERT INTO `attack_method_info` (`attack_method_id`, `attack_method_name`, `attack_method_desc`, `attack_method_details`, `attack_method_paper`, `attack_method_paper_url`, `attack_method_type`, `create_user`, `create_time`, `is_disabled`) VALUES (2, 'FGSM', '', '', 'Explaining and Harnessing Adversarial Examples', 'https://arxiv.org/pdf/1412.6572.pdf', 1, 'admin', '2022-10-04 23:35:18', 0);
INSERT INTO `attack_method_info` (`attack_method_id`, `attack_method_name`, `attack_method_desc`, `attack_method_details`, `attack_method_paper`, `attack_method_paper_url`, `attack_method_type`, `create_user`, `create_time`, `is_disabled`) VALUES (3, 'JSMA', 'JSMA由Papernot等人提出，是一种利用Saliency Map(显著图) 的迭代攻击算法。', '<p> JSMA算法的灵感来自于计算机视觉领域的显著图。简单来说，就是不同输入特征对分类器产生不同输出的影响程度不同。如果我们发现某些特征对应着分类器中某个特定的输出，我们可以通过在输入样本中增强这些特征来使得分类器产生指定类型的输出。JSMA算法主要包括三个过程：计算前向导数，计算对抗性显著图，添加扰动。</p>\r\n', 'The Limitations of Deep Learning in Adversarial Settings', 'http://arxiv.org/pdf/1511.07528', 1, 'admin', '2022-10-05 15:29:30', 0);
INSERT INTO `attack_method_info` (`attack_method_id`, `attack_method_name`, `attack_method_desc`, `attack_method_details`, `attack_method_paper`, `attack_method_paper_url`, `attack_method_type`, `create_user`, `create_time`, `is_disabled`) VALUES (4, 'DeepFool', NULL, NULL, 'DeepFool: a simple and accurate method to fool deep neural networks', 'https://arxiv.org/pdf/1511.04599.pdf', 1, NULL, NULL, 0);
INSERT INTO `attack_method_info` (`attack_method_id`, `attack_method_name`, `attack_method_desc`, `attack_method_details`, `attack_method_paper`, `attack_method_paper_url`, `attack_method_type`, `create_user`, `create_time`, `is_disabled`) VALUES (5, 'BIM [I-FGSM]', NULL, NULL, 'Adversarial Examples in the Physical World', 'https://arxiv.org/pdf/1511.04599.pdf', 1, NULL, NULL, 0);
INSERT INTO `attack_method_info` (`attack_method_id`, `attack_method_name`, `attack_method_desc`, `attack_method_details`, `attack_method_paper`, `attack_method_paper_url`, `attack_method_type`, `create_user`, `create_time`, `is_disabled`) VALUES (6, 'CW', NULL, NULL, 'Towards evaluating the robustness of neural networks', 'https://arxiv.org/pdf/1706.06083.pdf', 1, NULL, NULL, 0);
INSERT INTO `attack_method_info` (`attack_method_id`, `attack_method_name`, `attack_method_desc`, `attack_method_details`, `attack_method_paper`, `attack_method_paper_url`, `attack_method_type`, `create_user`, `create_time`, `is_disabled`) VALUES (7, 'UAP', NULL, NULL, 'Universal adversarial perturbations', 'https://openaccess.thecvf.com/content_cvpr_2017/papers/Moosavi-Dezfooli_Universal_Adversarial_Perturbations_CVPR_2017_paper.pdf', 1, NULL, NULL, 0);
INSERT INTO `attack_method_info` (`attack_method_id`, `attack_method_name`, `attack_method_desc`, `attack_method_details`, `attack_method_paper`, `attack_method_paper_url`, `attack_method_type`, `create_user`, `create_time`, `is_disabled`) VALUES (8, 'PGD', '', NULL, 'Towards Deep Learning Models Resistant to Adversarial Attacks', 'https://arxiv.org/pdf/1706.06083.pdf', 1, NULL, NULL, 0);
INSERT INTO `attack_method_info` (`attack_method_id`, `attack_method_name`, `attack_method_desc`, `attack_method_details`, `attack_method_paper`, `attack_method_paper_url`, `attack_method_type`, `create_user`, `create_time`, `is_disabled`) VALUES (9, 'MIM [MI-FGSM]', 'MIM全称Momentum Iterative Method，由Dong等人提出，是一种基于梯度的迭代攻击算法。', '<p>请参考：https://arxiv.org/pdf/1710.06081.pdf</p>', 'Boosting Adversarial Attacks with Momentum', 'https://arxiv.org/pdf/1710.06081.pdf', 1, 'admin', '2022-01-06 21:38:40', 0);
INSERT INTO `attack_method_info` (`attack_method_id`, `attack_method_name`, `attack_method_desc`, `attack_method_details`, `attack_method_paper`, `attack_method_paper_url`, `attack_method_type`, `create_user`, `create_time`, `is_disabled`) VALUES (10, 'One-pixel Attack', NULL, NULL, 'One pixel attack for fooling deep neural networks', 'https://arxiv.org/pdf/1710.08864.pdf', 2, NULL, NULL, 0);
INSERT INTO `attack_method_info` (`attack_method_id`, `attack_method_name`, `attack_method_desc`, `attack_method_details`, `attack_method_paper`, `attack_method_paper_url`, `attack_method_type`, `create_user`, `create_time`, `is_disabled`) VALUES (313, '1', '', '', '', '', 1, 'admin', '2022-10-07 19:41:12', 1);
COMMIT;

-- ----------------------------
-- Table structure for attack_method_provider
-- ----------------------------
DROP TABLE IF EXISTS `attack_method_provider`;
CREATE TABLE `attack_method_provider` (
  `attack_method_provider_id` int NOT NULL AUTO_INCREMENT,
  `attack_method_id` int NOT NULL,
  `node_id` int NOT NULL,
  `attack_method_source` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `bind_attack_method_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `is_disabled` tinyint(3) unsigned zerofill DEFAULT NULL,
  PRIMARY KEY (`attack_method_provider_id`) USING BTREE,
  KEY `attack_method_id` (`attack_method_id`) USING BTREE,
  KEY `node_id` (`node_id`) USING BTREE,
  CONSTRAINT `attack_method_provider_ibfk_1` FOREIGN KEY (`attack_method_id`) REFERENCES `attack_method_info` (`attack_method_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `attack_method_provider_ibfk_2` FOREIGN KEY (`node_id`) REFERENCES `node_info` (`node_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of attack_method_provider
-- ----------------------------
BEGIN;
INSERT INTO `attack_method_provider` (`attack_method_provider_id`, `attack_method_id`, `node_id`, `attack_method_source`, `bind_attack_method_name`, `create_time`, `is_disabled`) VALUES (1, 6, 1, 'CleverHans库', 'CW', '2022-08-06 09:59:25', 000);
INSERT INTO `attack_method_provider` (`attack_method_provider_id`, `attack_method_id`, `node_id`, `attack_method_source`, `bind_attack_method_name`, `create_time`, `is_disabled`) VALUES (2, 3, 1, '官方实现', 'JSMA', '2022-09-26 16:01:21', 000);
INSERT INTO `attack_method_provider` (`attack_method_provider_id`, `attack_method_id`, `node_id`, `attack_method_source`, `bind_attack_method_name`, `create_time`, `is_disabled`) VALUES (3, 6, 2, '官方实现', 'CW2', '2022-08-06 15:06:21', 000);
INSERT INTO `attack_method_provider` (`attack_method_provider_id`, `attack_method_id`, `node_id`, `attack_method_source`, `bind_attack_method_name`, `create_time`, `is_disabled`) VALUES (8, 3, 10, '111', '11', '2022-10-07 20:58:34', 000);
COMMIT;

-- ----------------------------
-- Table structure for attack_method_type
-- ----------------------------
DROP TABLE IF EXISTS `attack_method_type`;
CREATE TABLE `attack_method_type` (
  `attack_method_type_id` int NOT NULL,
  `attack_method_type_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `attack_method_type_icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `attack_method_base_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `target_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `is_disabled` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`attack_method_type_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of attack_method_type
-- ----------------------------
BEGIN;
INSERT INTO `attack_method_type` (`attack_method_type_id`, `attack_method_type_name`, `attack_method_type_icon`, `attack_method_base_type`, `target_type`, `create_time`, `is_disabled`) VALUES (1, '对抗样本攻击(白盒)', NULL, NULL, 'img', '2022-01-06 21:29:40', '0');
INSERT INTO `attack_method_type` (`attack_method_type_id`, `attack_method_type_name`, `attack_method_type_icon`, `attack_method_base_type`, `target_type`, `create_time`, `is_disabled`) VALUES (2, '对抗样本攻击(黑盒)', NULL, NULL, NULL, NULL, '0');
COMMIT;

-- ----------------------------
-- Table structure for dataset_info
-- ----------------------------
DROP TABLE IF EXISTS `dataset_info`;
CREATE TABLE `dataset_info` (
  `dataset_id` int NOT NULL AUTO_INCREMENT,
  `dataset_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `dataset_desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `dataset_website` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `dataset_class_number` int DEFAULT NULL,
  `create_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `is_disabled` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`dataset_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of dataset_info
-- ----------------------------
BEGIN;
INSERT INTO `dataset_info` (`dataset_id`, `dataset_name`, `dataset_desc`, `dataset_website`, `dataset_class_number`, `create_user`, `create_time`, `is_disabled`) VALUES (1, 'ImageNet2012', 'ImageNet是一个计算机视觉系统识别项目，是目前世界上图像识别最大的数据库。是美国斯坦福的计算机科学家，模拟人类的识别系统建立的。能够从图片中识别物体。ImageNet是一个非常有前景的研究项目，未来用在机器人身上，就可以直接辨认物品和人了。超过1400万的图像URL被ImageNet手动注释，以指示图片中的对象;在至少一百万张图像中，还提供了边界框。ImageNet包含2万多个类别; 一个典型的类别，如“气球”或“草莓”，每个类包含数百张图像。', NULL, 1000, 'admin', '2022-08-14 11:34:04', '0');
COMMIT;

-- ----------------------------
-- Table structure for dataset_provider
-- ----------------------------
DROP TABLE IF EXISTS `dataset_provider`;
CREATE TABLE `dataset_provider` (
  `dataset_provider_id` int NOT NULL AUTO_INCREMENT,
  `dataset_id` int NOT NULL,
  `node_id` int NOT NULL,
  `dataset_source` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `bind_dataset_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `dataset_type_desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `is_provide_tags` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `is_disabled` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`dataset_provider_id`) USING BTREE,
  KEY `node_id` (`node_id`) USING BTREE,
  KEY `dataset_id` (`dataset_id`) USING BTREE,
  CONSTRAINT `dataset_provider_ibfk_1` FOREIGN KEY (`dataset_id`) REFERENCES `dataset_info` (`dataset_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `dataset_provider_ibfk_2` FOREIGN KEY (`node_id`) REFERENCES `node_info` (`node_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of dataset_provider
-- ----------------------------
BEGIN;
INSERT INTO `dataset_provider` (`dataset_provider_id`, `dataset_id`, `node_id`, `dataset_source`, `bind_dataset_name`, `dataset_type_desc`, `is_provide_tags`, `create_time`, `is_disabled`) VALUES (1, 1, 1, 'Stanford University (ILSVRC)', 'ILSVRC-2012', 'ILSVRC - Val', 'true', '2022-08-14 11:36:30', '0');
COMMIT;

-- ----------------------------
-- Table structure for model_config
-- ----------------------------
DROP TABLE IF EXISTS `model_config`;
CREATE TABLE `model_config` (
  `model_config_id` int NOT NULL AUTO_INCREMENT,
  `model_provider_id` int DEFAULT NULL,
  `config_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `config_desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `config_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `config_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `create_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `is_disabled` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`model_config_id`) USING BTREE,
  KEY `model_provider_id` (`model_provider_id`) USING BTREE,
  CONSTRAINT `model_config_ibfk_1` FOREIGN KEY (`model_provider_id`) REFERENCES `model_provider` (`model_provider_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of model_config
-- ----------------------------
BEGIN;
INSERT INTO `model_config` (`model_config_id`, `model_provider_id`, `config_name`, `config_desc`, `config_json`, `config_type`, `create_user`, `create_time`, `is_disabled`) VALUES (1, 1, '配置A', '配置A', '{}', 'ModelConfig', 'admin', '2022-08-07 22:29:00', '0');
INSERT INTO `model_config` (`model_config_id`, `model_provider_id`, `config_name`, `config_desc`, `config_json`, `config_type`, `create_user`, `create_time`, `is_disabled`) VALUES (2, 1, '配置A', '配置A', '{}', 'ImgProcConfig', 'admin', '2022-08-08 07:59:45', '0');
COMMIT;

-- ----------------------------
-- Table structure for model_info
-- ----------------------------
DROP TABLE IF EXISTS `model_info`;
CREATE TABLE `model_info` (
  `model_id` int NOT NULL AUTO_INCREMENT,
  `model_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `model_desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `model_details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `model_paper` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `model_paper_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `model_type` int DEFAULT NULL,
  `create_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `is_disabled` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`model_id`) USING BTREE,
  KEY `model_type` (`model_type`) USING BTREE,
  KEY `create_user` (`create_user`) USING BTREE,
  CONSTRAINT `model_info_ibfk_1` FOREIGN KEY (`model_type`) REFERENCES `model_type` (`model_type_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `model_info_ibfk_2` FOREIGN KEY (`create_user`) REFERENCES `user_info` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of model_info
-- ----------------------------
BEGIN;
INSERT INTO `model_info` (`model_id`, `model_name`, `model_desc`, `model_details`, `model_paper`, `model_paper_url`, `model_type`, `create_user`, `create_time`, `is_disabled`) VALUES (1, 'AlexNet', 'AlexNet被广泛用于机器学习分类，是2012年ImageNet竞赛冠军获得者Hinton和他的学生Alex Krizhevsky设计的。AlexNet中包含了几个比较新的技术点，也首次在CNN中成功应用了ReLU、Dropout和LRN等Trick。同时AlexNet也使用了GPU进行运算加速。', '<p>请参考：https://blog.csdn.net/luoluonuoyasuolong/article/details/81750190</p><img src=\'http://localhost:8081/images/alexNet-1.jpg\' width=\'100%\'/><p>第一个典型的CNN是LeNet5网络结构，但是第一个引起大家注意的网络却是AlexNet，也就是文章《ImageNet Classification with Deep Convolutional Neural Networks》介绍的网络结构。这篇文章的网络是在2012年的ImageNet竞赛中取得冠军的一个模型整理后发表的文章。作者是多伦多大学的Alex Krizhevsky等人。Alex Krizhevsky其实是Hinton的学生，这个团队领导者是Hinton，那么Hinton是谁呢？这就要好好说说了，网上流行说 Hinton， LeCun和Bengio是神经网络领域三巨头，LeCun就是LeNet5作者(Yann LeCun)，昨天的文章就提到了这个人。而今天的主角虽然不是Hinton，但却和他有关系，这篇的论文第一作者是Alex，所以网络结构称为AlexNet。这篇论文很有意思，因为我读完这篇论文之后，没有遇到比较难以理解的地方，遇到的都是之前学过的概念，比如Relu，dropout。之前学的时候只知道Relu是怎么一回事，今天才知道它真正的来源。这篇文章在2012年发表，文章中的模型参加的竞赛是ImageNet LSVRC-2010，该ImageNet数据集有1.2 million幅高分辨率图像，总共有1000个类别。测试集分为top-1和top-5，并且分别拿到了37.5%和17%的error rates。这样的结果在当时已经超过了之前的工艺水平。AlexNet网络结构在整体上类似于LeNet，都是先卷积然后在全连接。但在细节上有很大不同。AlexNet更为复杂。AlexNet有60 million个参数和65000个 神经元，五层卷积，三层全连接网络，最终的输出层是1000通道的softmax。AlexNet利用了两块GPU进行计算，大大提高了运算效率，并且在ILSVRC-2012竞赛中获得了top-5测试的15.3%error rate， 获得第二名的方法error rate 是 26.2%，可以说差距是非常的大了，足以说明这个网络在当时给学术界和工业界带来的冲击之大。</p>', 'ImageNet Classification with Deep Convolutional Neural Networks', 'https://sci-hub.se/10.1145/3065386', 1, 'admin', '2022-01-02 15:30:56', 'false');
INSERT INTO `model_info` (`model_id`, `model_name`, `model_desc`, `model_details`, `model_paper`, `model_paper_url`, `model_type`, `create_user`, `create_time`, `is_disabled`) VALUES (2, 'VGG-16', NULL, NULL, NULL, NULL, 1, 'admin', '2022-08-22 17:40:42', 'false');
COMMIT;

-- ----------------------------
-- Table structure for model_provider
-- ----------------------------
DROP TABLE IF EXISTS `model_provider`;
CREATE TABLE `model_provider` (
  `model_provider_id` int NOT NULL,
  `model_id` int DEFAULT NULL,
  `bind_model_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `node_id` int DEFAULT NULL,
  `model_source` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `is_api` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `train_dataset_id` int DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `is_disabled` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`model_provider_id`) USING BTREE,
  KEY `model_id` (`model_id`) USING BTREE,
  KEY `node_id` (`node_id`) USING BTREE,
  KEY `train_dataset_id` (`train_dataset_id`) USING BTREE,
  CONSTRAINT `model_provider_ibfk_1` FOREIGN KEY (`model_id`) REFERENCES `model_info` (`model_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `model_provider_ibfk_2` FOREIGN KEY (`node_id`) REFERENCES `node_info` (`node_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `model_provider_ibfk_3` FOREIGN KEY (`train_dataset_id`) REFERENCES `dataset_info` (`dataset_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of model_provider
-- ----------------------------
BEGIN;
INSERT INTO `model_provider` (`model_provider_id`, `model_id`, `bind_model_name`, `node_id`, `model_source`, `is_api`, `train_dataset_id`, `create_time`, `is_disabled`) VALUES (1, 1, 'Alexnet', 1, 'Torchvision', 'false', 1, '2022-08-11 22:01:07', '0');
INSERT INTO `model_provider` (`model_provider_id`, `model_id`, `bind_model_name`, `node_id`, `model_source`, `is_api`, `train_dataset_id`, `create_time`, `is_disabled`) VALUES (2, 2, 'VGG-16', 1, 'Torchvision', 'false', 1, '2022-08-22 17:41:12', '0');
COMMIT;

-- ----------------------------
-- Table structure for model_type
-- ----------------------------
DROP TABLE IF EXISTS `model_type`;
CREATE TABLE `model_type` (
  `model_type_id` int NOT NULL,
  `model_type_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `model_type_icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `target_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `is_disabled` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`model_type_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of model_type
-- ----------------------------
BEGIN;
INSERT INTO `model_type` (`model_type_id`, `model_type_name`, `model_type_icon`, `target_type`, `create_time`, `is_disabled`) VALUES (1, '图片分类模型', 'mdi-camera-plus', 'img', '2022-01-04 16:14:26', 'false');
INSERT INTO `model_type` (`model_type_id`, `model_type_name`, `model_type_icon`, `target_type`, `create_time`, `is_disabled`) VALUES (2, '百度AI开放平台API', 'mdi-api', 'img', '2022-01-06 17:16:41', 'false');
COMMIT;

-- ----------------------------
-- Table structure for node_info
-- ----------------------------
DROP TABLE IF EXISTS `node_info`;
CREATE TABLE `node_info` (
  `node_id` int NOT NULL AUTO_INCREMENT,
  `host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `port` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `node_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `node_desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `create_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `is_disabled` tinyint DEFAULT NULL,
  PRIMARY KEY (`node_id`) USING BTREE,
  KEY `create_user` (`create_user`) USING BTREE,
  CONSTRAINT `node_info_ibfk_1` FOREIGN KEY (`create_user`) REFERENCES `user_info` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of node_info
-- ----------------------------
BEGIN;
INSERT INTO `node_info` (`node_id`, `host`, `port`, `node_name`, `node_desc`, `create_time`, `create_user`, `is_disabled`) VALUES (1, '10.108.16.242', '5000', 'Canary-Master节点', '官方节点', '2022-09-15 11:07:58', 'admin', 0);
INSERT INTO `node_info` (`node_id`, `host`, `port`, `node_name`, `node_desc`, `create_time`, `create_user`, `is_disabled`) VALUES (2, '127.0.0.1', '4000', '测试', '测试', '2022-09-15 11:07:51', 'admin', 0);
INSERT INTO `node_info` (`node_id`, `host`, `port`, `node_name`, `node_desc`, `create_time`, `create_user`, `is_disabled`) VALUES (3, '11.11.11.11', '1', NULL, NULL, '2022-09-15 11:07:51', 'admin', 0);
INSERT INTO `node_info` (`node_id`, `host`, `port`, `node_name`, `node_desc`, `create_time`, `create_user`, `is_disabled`) VALUES (4, NULL, NULL, NULL, NULL, '2022-09-15 11:07:51', 'admin', 0);
INSERT INTO `node_info` (`node_id`, `host`, `port`, `node_name`, `node_desc`, `create_time`, `create_user`, `is_disabled`) VALUES (5, NULL, NULL, NULL, NULL, '2022-09-15 11:07:51', 'admin', 0);
INSERT INTO `node_info` (`node_id`, `host`, `port`, `node_name`, `node_desc`, `create_time`, `create_user`, `is_disabled`) VALUES (6, NULL, NULL, NULL, NULL, '2022-09-15 11:07:51', 'admin', 0);
INSERT INTO `node_info` (`node_id`, `host`, `port`, `node_name`, `node_desc`, `create_time`, `create_user`, `is_disabled`) VALUES (7, NULL, NULL, NULL, NULL, '2022-09-15 11:07:51', 'admin', 0);
INSERT INTO `node_info` (`node_id`, `host`, `port`, `node_name`, `node_desc`, `create_time`, `create_user`, `is_disabled`) VALUES (8, NULL, NULL, NULL, NULL, '2022-09-15 11:07:51', 'admin', 0);
INSERT INTO `node_info` (`node_id`, `host`, `port`, `node_name`, `node_desc`, `create_time`, `create_user`, `is_disabled`) VALUES (9, NULL, NULL, NULL, NULL, '2022-09-15 11:07:51', 'admin', 0);
INSERT INTO `node_info` (`node_id`, `host`, `port`, `node_name`, `node_desc`, `create_time`, `create_user`, `is_disabled`) VALUES (10, NULL, NULL, NULL, NULL, '2022-09-15 11:07:51', 'admin', 0);
INSERT INTO `node_info` (`node_id`, `host`, `port`, `node_name`, `node_desc`, `create_time`, `create_user`, `is_disabled`) VALUES (11, NULL, NULL, NULL, NULL, '2022-09-15 11:07:51', 'admin', 0);
COMMIT;

-- ----------------------------
-- Table structure for task_base_info
-- ----------------------------
DROP TABLE IF EXISTS `task_base_info`;
CREATE TABLE `task_base_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `task_desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `task_node_id` int DEFAULT NULL,
  `task_type_id` int DEFAULT NULL,
  `config` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `batch_token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `create_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `is_disabled` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `task_node` (`task_node_id`) USING BTREE,
  KEY `task_type` (`task_type_id`) USING BTREE,
  CONSTRAINT `task_base_info_ibfk_1` FOREIGN KEY (`task_node_id`) REFERENCES `node_info` (`node_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `task_base_info_ibfk_2` FOREIGN KEY (`task_type_id`) REFERENCES `task_type` (`task_type_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of task_base_info
-- ----------------------------
BEGIN;
INSERT INTO `task_base_info` (`id`, `task_name`, `task_desc`, `task_node_id`, `task_type_id`, `config`, `batch_token`, `create_time`, `create_user`, `is_disabled`) VALUES (16, '测试2022-8-19', '测试', 1, 1, '{\"dataset_size\":10,\"dataset\":\"ILSVRC-2012\",\"attacker_list\":[\"CW\"],\"attacker_config\":{\"CW\":{\"n_classes\":1000,\"lr\":0.005,\"confidence\":0,\"clip_min\":-3,\"clip_max\":3,\"initial_const\":0.01,\"binary_search_steps\":5,\"max_iterations\":1000,\"attack_type\":\"UNTARGETED\",\"tlabel\":null}},\"model_list\":[\"Alexnet\"],\"model_config\":{\"Alexnet\":{}},\"img_proc_config\":{\"Alexnet\":{}}}', NULL, '2022-08-19 17:54:01', 'admin', '0');
INSERT INTO `task_base_info` (`id`, `task_name`, `task_desc`, `task_node_id`, `task_type_id`, `config`, `batch_token`, `create_time`, `create_user`, `is_disabled`) VALUES (17, '测试任务2022-08', '测试任务描述', 1, 1, '{\"dataset_size\":20,\"dataset\":\"ILSVRC-2012\",\"attacker_list\":[\"CW\"],\"attacker_config\":{\"CW\":{\"n_classes\":1000,\"lr\":0.005,\"confidence\":0,\"clip_min\":-3,\"clip_max\":3,\"initial_const\":0.01,\"binary_search_steps\":5,\"max_iterations\":1000,\"attack_type\":\"UNTARGETED\",\"tlabel\":null}},\"model_list\":[\"Alexnet\"],\"model_config\":{\"Alexnet\":{}},\"img_proc_config\":{\"Alexnet\":{}}}', NULL, '2022-08-19 21:38:03', 'admin', '0');
INSERT INTO `task_base_info` (`id`, `task_name`, `task_desc`, `task_node_id`, `task_type_id`, `config`, `batch_token`, `create_time`, `create_user`, `is_disabled`) VALUES (18, '测试', '测试描述', 1, 1, '{\"dataset_size\":10,\"dataset\":\"ILSVRC-2012\",\"attacker_list\":[\"CW\"],\"attacker_config\":{\"CW\":{\"n_classes\":1000,\"lr\":0.005,\"confidence\":0,\"clip_min\":-3,\"clip_max\":3,\"initial_const\":0.01,\"binary_search_steps\":5,\"max_iterations\":1000,\"attack_type\":\"UNTARGETED\",\"tlabel\":null}},\"model_list\":[\"Alexnet\"],\"model_config\":{\"Alexnet\":{}},\"img_proc_config\":{\"Alexnet\":{}}}', NULL, '2022-08-22 11:35:58', 'admin', '0');
COMMIT;

-- ----------------------------
-- Table structure for task_type
-- ----------------------------
DROP TABLE IF EXISTS `task_type`;
CREATE TABLE `task_type` (
  `task_type_id` int NOT NULL,
  `type_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `sub_type_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `target_api` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `api_version` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`task_type_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of task_type
-- ----------------------------
BEGIN;
INSERT INTO `task_type` (`task_type_id`, `type_name`, `sub_type_name`, `target_api`, `api_version`) VALUES (1, 'AttackTest', '仅生成对抗样本', NULL, '2');
COMMIT;

-- ----------------------------
-- Table structure for user_info
-- ----------------------------
DROP TABLE IF EXISTS `user_info`;
CREATE TABLE `user_info` (
  `user_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `nickname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `phone_number` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `role` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`user_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of user_info
-- ----------------------------
BEGIN;
INSERT INTO `user_info` (`user_id`, `username`, `nickname`, `phone_number`, `password`, `role`) VALUES ('admin', 'admin', '北理网安管理员', NULL, NULL, NULL);
INSERT INTO `user_info` (`user_id`, `username`, `nickname`, `phone_number`, `password`, `role`) VALUES ('fd56a40c9ce2b2564ed0ec25d76ad1d5', 'neosunjz', '孙家正', '13305356699', NULL, 'user');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
