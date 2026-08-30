# RenWork 网站知识中心映射

> 这是发行模板中的发布设计，不代表网站已经修改。正式接入前必须重新核验目标环境、当前 canonical、跳转、证书和发布权限。

## 建议信息架构

| 建议路径 | 用户问题 | 来源模块 | 当前发布状态 |
|---|---|---|---|
| `/knowledge/what-is-renwork` | RenWork 是什么 | 02、03、04 | PARTIAL：仅当前公开定位已批准 |
| `/knowledge/ai-find-buyers` | 如何用 AI 找客户 | 08-14 | DRAFT：需 Provider 与能力状态核对 |
| `/knowledge/customer-assets` | 如何管理客户与商机 | 10、14、15 | DRAFT：可先发布方法，不发布客户数据 |
| `/knowledge/inquiry-to-order` | 如何从询盘到订单 | 15-19 | DRAFT：需商务与交付 Owner 审核 |
| `/knowledge/content-growth` | 如何做 SEO/GEO/社媒/邮件 | 03、18 | DRAFT：发布与外联需审批说明 |
| `/knowledge/trust-security` | 数据、权限和 AI 安全如何治理 | 00、01、05、06 | DRAFT：需安全/法务复核 |
| `/knowledge/industry/export-b2b` | 外贸企业如何使用 | export-b2b 包 | DRAFT：Phase 1 主页面 |
| `/knowledge/industry/{pack_id}` | 某行业如何适配 | 对应行业包 | BLOCKED：仅 ACTIVE/PILOT 可生成 |
| `/knowledge/faq` | 高频产品与使用问题 | 全模块批准卡片 | BUILD |
| `/knowledge/changelog` | 哪些能力和口径更新了 | 00、20 | BUILD |

## 网站内容生成合同

每个页面必须包含：

- `page_id`、标题和目标角色；
- 回答的业务问题；
- 引用的知识卡 ID；
- 事实状态、适用条件和更新时间；
- 当前能力状态：AVAILABLE/INTEGRATE/BUILD/FUTURE_RESEARCH；
- 可执行下一步；
- 风险和不适用范围；
- 审核人、发布日期和回滚版本。

## 发布流水线

```text
选择场景和批准知识卡
  → 生成页面草稿
  → 事实/引用检查
  → 产品能力状态检查
  → 品牌与 SEO/GEO 检查
  → 安全/合规/商业检查
  → 人工批准
  → 预览环境
  → 发布
  → 线上 URL、结构化数据和引用验证
```

## 当前可公开与不可公开

### 已有公开证据

- 当前官网公开定位：企业级外贸 B2B 增长操作系统与 AI 数字员工平台；
- 本发行快照可核对的 canonical 来源：`https://www.rrenn.com/`；发布时必须重新核验。

### 仍需批准

- 所有功能可用性、连接器覆盖、客户结果、案例、性能和安全承诺；
- 价格、套餐、免费政策、本地/BYOK/Ollama 和 RenCredit 权益；
- 客户 Logo、客户故事、数据量和转化提升；
- “覆盖所有行业”及具体行业能力；
- 下载版本、支持系统、上线时间和服务 SLA。

## SEO/GEO 原则

1. 一页解决一个明确问题，不堆关键词；
2. 结论前置，附适用条件、证据和更新时间；
3. 产品能力与方法内容分开；
4. 使用稳定实体名和内部链接形成主题集群；
5. FAQ 只收录高频、可复用、可批准的问题；
6. 结构化数据不得包含未批准价格、评价、排名或能力；
7. 页面上线后验证 canonical、索引、链接、移动端和实际文本。
