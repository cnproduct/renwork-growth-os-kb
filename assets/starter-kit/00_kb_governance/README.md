---
kb_id: RW-RWPLAT-0001
tenant_id: renwork-platform
module: 00_kb_governance
status: strategy_recommendation
confidence: 0.95
sensitivity: internal
public_claim_approved: false
created_at: 2026-08-30T10:30:39.882Z
updated_at: 2026-08-30T10:30:39.882Z
---

# 知识库总索引与治理

## 结论

RenWork 知识库采用“21 模块稳定内核 + 外贸增长行业包 + 后续跨行业包”。Phase 1 只聚焦外贸企业 AI 自动化增长，不把跨行业路线写成已完成能力。

## 必备输出

- [x] 知识地图：`../KNOWLEDGE_MAP.md`
- [x] 来源登记：`../01_sources_permissions/SOURCE_REGISTRY.json`
- [x] 能力状态：`../02_company_identity/CAPABILITY_STATUS.md`
- [x] 路线图：`../ROADMAP.md`
- [x] 知识卡：`../cards/knowledge_cards.json`
- [x] 行业包：`../industry-packs/`
- [x] 黄金评测：`../evals/golden_cases.json`
- [x] 公开发行敏感信息扫描与结构完整性验证

## 治理原则

1. 先身份和租户，再决定可访问知识与工具；
2. 事实、公开定位、推断、策略、冲突和待补充分开；
3. 内容贡献权限与数据访问权限分开；
4. 当前能力与未来设计分开；
5. 企业事实不硬编码进 Skill；
6. 对外动作和高风险承诺设置人工闸门；
7. 使用失败进入缺口、冲突、过期或错误集队列。

## 当前成熟度

V1 目标为 M2“可追溯”并为 M3“可执行”建立结构。生产部署、真实连接器、跨行业和自动学习需要独立验收。

## 红线

任何未经证据、权限、状态和审批确认的内容，不得因出现在知识库中就自动对外使用。
