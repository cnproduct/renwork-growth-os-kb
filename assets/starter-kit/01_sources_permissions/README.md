---
kb_id: RW-RWPLAT-0002
tenant_id: renwork-platform
module: 01_sources_permissions
status: verified_fact
confidence: 1
sensitivity: internal
public_claim_approved: false
created_at: 2026-08-30T10:30:39.882Z
updated_at: 2026-08-30T10:30:39.882Z
---

# 来源、证据、权限与口径

## 结论

所有 RenWork 知识必须同时记录来源等级、事实状态、敏感度、公开批准、租户范围和时间有效性。任何一个字段都不能替代其他字段。

## 证据等级

| 等级 | 本知识库定义 | 典型来源 |
|---|---|---|
| S | 受控权威源 | 已批准制度、签署文件、版本化代码/Schema、权威业务数据库 |
| A | 官方公开源 | 官方网站、正式公告、权威机构公开材料 |
| B | 已知主体提供的参考资料 | 用户提供文件、内部报告、可追溯会议结论 |
| C | 可核对的二级来源 | 行业媒体、专业数据库、第三方研究 |
| D | 派生或建议 | AI 推断、策略建议、规划草案 |
| I | 不足或不可访问 | 只有标题、目录、无法读取内容或来源不明 |

等级只表达来源权威性。事实仍需单独标记 `verified_fact/public_fact/ai_inference/strategy_recommendation/pending_supplement/deprecated/conflicted`。

## 必备输出

- [x] `SOURCE_REGISTRY.json`
- [x] `DOMAIN_DECISION.md`
- [x] `POLICY.md`
- [x] 差异图中的冲突记录
- [ ] 当前权威价格与订阅目录
- [ ] 产品能力逐项生产验收记录

## 红线

不能因为内容来自官网，就把营销表达转换为独立事实；不能因为本地代码存在，就宣称已经生产部署；不能因为目录或标题可见，就宣称正文已读取。
