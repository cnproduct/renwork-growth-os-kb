---
kb_id: RW-RWPLAT-0007
tenant_id: renwork-platform
module: 06_certification_compliance
status: pending_supplement
confidence: 0
sensitivity: public
public_claim_approved: false
created_at: 2026-08-30T10:30:39.882Z
updated_at: 2026-08-30T10:30:39.882Z
---

# 数据、AI、营销与行业合规

## 结论
RenWork 的通用合规底座负责数据分类、租户隔离、最小权限、来源与授权、营销许可、退订/黑名单、高风险审批和审计；行业法规由行业包追加，不能由通用模板直接认定。

## 必备输出
- [x] public/internal/restricted 分级
- [x] 退订、黑名单和许可硬停止
- [x] 对外声明审批字段
- [x] 行业包候选合规项必须二次核验
- [ ] 隐私、跨境、数据保存和删除的正式法务矩阵
- [ ] 高监管行业专业审核与适用法律清单

## 证据
仓库 `docs/DATA_CLASSIFICATION.md`、`docs/COMPLIANCE.md`、`docs/SECURITY_POLICIES.md`。

## 推荐动作
由法务/安全/业务 Owner 按市场与数据类型建立正式控制矩阵。

## 红线
知识库不替代律师、监管机构、认证机构或专业人士；行业包中的认证名称只是核验候选词。

## 待确认
正式控制人、法域、保存期限、删除机制、数据主体权利和事件响应流程。
