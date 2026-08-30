---
kb_id: RW-RWPLAT-0014
tenant_id: renwork-platform
module: 13_lead_discovery
status: strategy_recommendation
confidence: 0.95
sensitivity: public
public_claim_approved: false
created_at: 2026-08-30T10:30:39.882Z
updated_at: 2026-08-30T10:30:39.882Z
---

# AI 找客户与买家增长

## 普通用户旅程

```text
输入产品/市场/客户类型
  → 生成买家画像
  → 匹配候选企业
  → 展示买家证据等级
  → 展示可用决策角色/联系人状态
  → 去重与风险检查
  → 形成下一步触达计划
  → 进入询盘、报价、跟进与客户资产
```

普通界面使用“AI 找客户/买家增长”语言。Provider、API、MCP、Reveal Handle、额度和路由放在管理员高级设置与审计中，但必须透明记录来源、核验时间、成本和操作者。

## 必备输出
- [x] 结果导向用户旅程
- [x] L1 验真、L2 匹配、L3 深度调查结构
- [x] Go/Hold/Nurture/No-go 决策框架
- [x] 来源、许可、去重和风险边界
- [ ] 生产 Provider 授权、路由和计费验收
- [ ] 真实市场/企业数据覆盖与质量指标

## 证据
`SRC-FRAMEWORK-001`、本地 V4 架构和用户产品方向。

## 推荐动作
先返回公司级候选和证据，再按权限解锁已验证联系人；每一步保留来源和成本。

## 红线
公开线索、目录、网站匹配或联系方式不能证明真实采购关系、近期交易或决策权。

## 待确认
Provider 许可、覆盖范围、数据更新时间、成本、隐私与营销合法性。
