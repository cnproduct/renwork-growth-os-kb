# RenWork 知识地图

## 核心对象

| 对象 | 定义 | 外贸阶段实例 | 跨行业别名 |
|---|---|---|---|
| Organization | 使用 RenWork 的组织/租户 | 出口制造企业、外贸公司 | 企业、机构、学校、协会、门店 |
| Offering | 可交付的产品或服务 | SKU、OEM/ODM 方案 | 服务包、课程、项目、解决方案 |
| Evidence | 支持结论的来源 | 证书、图纸、官网、订单 | 制度、资质、案例、研究、业务记录 |
| Market | 目标市场与约束 | 国家、渠道、合规环境 | 区域、客群、平台、政策环境 |
| Persona | 目标组织与决策角色 | 进口商、品牌商、采购经理 | 客户、学员、患者、会员、合作方 |
| Signal | 触发判断的事件 | RFQ、样品反馈、贸易信号 | 咨询、报名、复购、风险事件 |
| Account | 组织级客户主体 | 海外买家公司 | 企业客户、机构客户、家庭账户 |
| Contact | 与 Account 关联的人 | 采购、老板、工程师 | 决策人、使用人、协作人 |
| Opportunity | 有目标与阶段的机会 | 询盘、报价、样品、订单 | 项目、招生机会、服务机会 |
| Interaction | 发生过的沟通和动作 | 邮件、LinkedIn、会议 | 电话、咨询、课堂、服务记录 |
| Transaction | 可核验业务结果 | 订单、回款、复购 | 合同、报名、付款、续费 |
| Workflow | 受控执行流程 | 背调、报价、跟进、交付 | 审批、服务、教学、运营 |
| RiskConsent | 风险、许可和硬停止 | 退订、黑名单、账期风险 | 隐私授权、监管限制、安全事件 |
| Content | 经批准的表达资产 | 开发信、产品页、FAQ | 官网、课程、通知、服务话术 |
| Metric | 评价知识和业务的指标 | 转化、复购、响应时长 | 任务完成、满意度、质量、收益 |

## 关系主链

```text
Organization
  ├─ owns → Offering
  ├─ governs → Evidence / Workflow / RiskConsent
  └─ serves → Market / Persona

Market + Persona + Offering + Evidence
  → Product/Problem-Solution Fit
  → Signal
  → Account + Contact
  → Opportunity
  → Interaction
  → Proposal/Quote
  → Transaction
  → Delivery/Service
  → Outcome + Metric
  → Learning / Knowledge Update
```

## 事实与动作分轨

- 事实轨：组织、产品服务、认证、客户、订单、权限、实时状态；
- 方法轨：画像、评分、流程、话术、案例和培训；
- 工具轨：搜索、读取、计算、外部连接、发布、审批；
- 任何工具动作都必须回到身份、租户、证据、权限和审计边界。

## 多行业扩展规则

1. 核心对象、模块 ID、证据状态和权限模型保持稳定；
2. 行业包只增加字段、术语、规则、角色别名、合规主题和评测案例；
3. 行业包不得硬编码真实客户、价格、凭据或未核验能力；
4. 高监管行业必须增加专业审核和更严格的拒答/升级测试；
5. 行业包通过试点门后才能从 `PLANNED` 升级为 `ACTIVE`。
