---
kb_id: RW-RWPLAT-0006
tenant_id: renwork-platform
module: 05_manufacturing_quality
status: verified_fact
confidence: 0.9
sensitivity: public
public_claim_approved: false
created_at: 2026-08-30T10:30:39.882Z
updated_at: 2026-08-30T10:30:39.882Z
---

# 工程、研发、质量与服务可靠性

## 结论
RenWork 的质量对象包括知识、代码、模型输出、第三方连接、权限、外部动作和业务结果。本发行版只提供知识结构、治理基线和校验脚本；生产可靠性仍需数据库、身份、审计、备份、监控和真实连接器验收。

## 必备输出
- [x] 本地 build/test/metadata/portal 门禁
- [x] 请求 ID、错误合同和未配置能力的诚实失败边界
- [x] Schema、租户和公开声明基础规则
- [ ] PostgreSQL RLS 与持久层生产验收
- [ ] OIDC、KMS、审计、备份恢复和压力测试
- [ ] 第三方连接器真实许可与故障演练

## 证据
`SRC-REPO-001`、`SRC-ARCH-001`。

## 推荐动作
每次发布分别记录源码、测试、部署、数据、角色、业务 E2E 和回滚状态。

## 红线
本地通过不等于云端上线；页面可见不等于第三方动作成功。

## 待确认
当前生产环境、发布版本、SLO、灾备、真实租户验收和支持责任。
