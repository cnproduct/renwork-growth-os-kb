---
kb_id: RW-RWPLAT-0015
tenant_id: renwork-platform
module: 14_customer_asset_lifecycle
status: verified_fact
confidence: 0.95
sensitivity: internal
public_claim_approved: false
created_at: 2026-08-30T10:30:39.882Z
updated_at: 2026-08-30T10:30:39.882Z
---

# 客户资产、老客户与关系生命周期

## 核心关系

Account、Contact、Opportunity、Interaction、Transaction、ProductInterest、Task、RiskConsent 必须分开建模并通过 ID 关联。一个公司可以有多个联系人、多个产品兴趣和并行商机。

## 三条独立评级轴

| 评级轴 | 回答什么 | 不得替代 |
|---|---|---|
| 买家/交易证据 E | 是否有可追溯的公司级采购或业务证据 | 不能由联系人存在替代 |
| 联系人验证 C | 邮箱/电话/身份/角色验证到什么程度 | 不能证明公司已采购 |
| 销售优先级 R | 当前是否值得投入、下一步是什么 | 不能升级 E/C 证据 |

## 运营规则

- 去重先于评分；
- 硬停止先于优先级；
- 弱信号不能单独升级高优先级；
- 评分必须可解释、版本化并按真实赢单/输单校准；
- 所有客户资料按租户隔离；
- 老客户的产品、样品、报价、订单和售后版本要可追溯。

## 必备输出
- [x] 八类实体 Schema
- [x] V4 可解释评分与风险硬停止基线
- [x] 八类动态名单设计
- [ ] 生产数据库、RLS 和主数据合并策略
- [ ] 真实 CRM/订单/互动数据接入
- [ ] 企业级评分校准与复购周期

## 证据
V4 `customer-graph.schema.json`、Core Customer Engine 与治理基准。

## 推荐动作
接入企业真实数据前，先确认字段口径、去重键、许可、保存期和主记录 Owner。

## 红线
不跨租户合并客户；不把未知值填 0；不把评分冒充证据。

## 待确认
生产数据源、合法基础、去重阈值、评分版本、复购周期和删除规则。
