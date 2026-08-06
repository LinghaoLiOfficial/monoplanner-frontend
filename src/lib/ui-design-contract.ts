export type UIFieldDefinition = {
  key: string;
  chineseName: string;
  englishName: string;
  meaning: string;
};

export const uiDesignFieldDefinitions = {
  ui_design: {
    key: "ui_design",
    chineseName: "UI视觉设计",
    englishName: "ui_design",
    meaning: "描述视觉系统、布局规则、组件样式规则和视觉表达约束的设计资产。",
  },
  version_summary: {
    key: "version_summary",
    chineseName: "版本摘要",
    englishName: "version_summary",
    meaning: "本次 UI 视觉设计版本的简要概括。",
  },
  visual_system: {
    key: "visual_system",
    chineseName: "视觉系统",
    englishName: "visual_system",
    meaning: "全局视觉语言，包括颜色、字体、间距、形状、阴影、主题和交互视觉规则。",
  },
  design_style: {
    key: "design_style",
    chineseName: "设计风格",
    englishName: "design_style",
    meaning: "产品整体视觉气质、风格方向和识别特征。",
  },
  style_description: {
    key: "style_description",
    chineseName: "风格描述",
    englishName: "style_description",
    meaning: "对整体视觉风格的自然语言说明。",
  },
  signature_traits: {
    key: "signature_traits",
    chineseName: "典型特征",
    englishName: "signature_traits",
    meaning: "该视觉风格最具有代表性的特征集合。",
  },
  trait: {
    key: "trait",
    chineseName: "特征",
    englishName: "trait",
    meaning: "一个典型视觉特征。",
  },
  design_principles: {
    key: "design_principles",
    chineseName: "设计原则",
    englishName: "design_principles",
    meaning: "指导 UI 设计保持一致性、可读性和可维护性的原则集合。",
  },
  design_principle: {
    key: "design_principle",
    chineseName: "原则",
    englishName: "design_principle",
    meaning: "一条 UI 设计原则。",
  },
  theme_configuration: {
    key: "theme_configuration",
    chineseName: "主题配置",
    englishName: "theme_configuration",
    meaning: "视觉系统支持的主题模式、默认主题和主题切换策略。",
  },
  theme_types: {
    key: "theme_types",
    chineseName: "类型",
    englishName: "theme_types",
    meaning: "当前产品支持的主题模式类型集合。",
  },
  light_mode: {
    key: "light_mode",
    chineseName: "浅色模式",
    englishName: "light_mode",
    meaning: "适合明亮环境和默认使用场景的浅色主题。",
  },
  dark_mode: {
    key: "dark_mode",
    chineseName: "暗色模式",
    englishName: "dark_mode",
    meaning: "适合低光环境或开发者偏好的暗色主题。",
  },
  default_theme: {
    key: "default_theme",
    chineseName: "默认",
    englishName: "default_theme",
    meaning: "系统初始使用的默认主题模式。",
  },
  color_system: {
    key: "color_system",
    chineseName: "颜色系统",
    englishName: "color_system",
    meaning: "颜色 token、语义颜色、状态色和使用规则。",
  },
  typography_system: {
    key: "typography_system",
    chineseName: "字体系统",
    englishName: "typography_system",
    meaning: "字体族策略、字号层级、字重、行高和文本角色规则。",
  },
  spacing_system: {
    key: "spacing_system",
    chineseName: "间距系统",
    englishName: "spacing_system",
    meaning: "基于网格的间距 token、布局密度和留白规则。",
  },
  shape_system: {
    key: "shape_system",
    chineseName: "形状系统",
    englishName: "shape_system",
    meaning: "圆角、胶囊形、头像圆形等形状 token 和使用规则。",
  },
  elevation_system: {
    key: "elevation_system",
    chineseName: "阴影系统",
    englishName: "elevation_system",
    meaning: "阴影、层级、弹层和卡片深度表达规则。",
  },
  interaction_visual_system: {
    key: "interaction_visual_system",
    chineseName: "交互视觉系统",
    englishName: "interaction_visual_system",
    meaning: "聚焦、悬停、禁用、加载、错误和动效等交互状态的视觉规则。",
  },
  layout_rules: {
    key: "layout_rules",
    chineseName: "布局规则",
    englishName: "layout_rules",
    meaning: "基于 UX 页面和区域的页面级布局、桌面端布局和移动端布局规则。",
  },
  layout_rule: {
    key: "layout_rule",
    chineseName: "页面",
    englishName: "layout_rule",
    meaning: "针对一个页面的布局规则对象。",
  },
  target_screen: {
    key: "target_screen",
    chineseName: "目标页面",
    englishName: "target_screen",
    meaning: "该布局规则对应的 UX 页面或前端页面。",
  },
  desktop_layout: {
    key: "desktop_layout",
    chineseName: "桌面端布局",
    englishName: "desktop_layout",
    meaning: "桌面端或大屏幕下的页面布局方式。",
  },
  mobile_layout: {
    key: "mobile_layout",
    chineseName: "移动端布局",
    englishName: "mobile_layout",
    meaning: "移动端或小屏幕下的页面布局方式。",
  },
  component_style_rules: {
    key: "component_style_rules",
    chineseName: "组件样式规则",
    englishName: "component_style_rules",
    meaning: "面向界面单元或组件的视觉主次、样式、状态和响应式表现规则。",
  },
  component_style_rule: {
    key: "component_style_rule",
    chineseName: "组件",
    englishName: "component_style_rule",
    meaning: "一个组件或界面单元的样式规则对象。",
  },
  component_name: {
    key: "component_name",
    chineseName: "组件名称",
    englishName: "component_name",
    meaning: "该组件或界面单元的名称，可供后续前端页面结构映射为 React 组件。",
  },
  visual_priority: {
    key: "visual_priority",
    chineseName: "视觉层级",
    englishName: "visual_priority",
    meaning: "该组件内部信息、操作和危险操作的主次关系。",
  },
  primary_content: {
    key: "primary_content",
    chineseName: "第一级内容",
    englishName: "primary_content",
    meaning: "组件中最重要、应最先被用户看到的内容。",
  },
  secondary_content: {
    key: "secondary_content",
    chineseName: "第二级内容",
    englishName: "secondary_content",
    meaning: "组件中的辅助核心内容，重要性低于第一级内容。",
  },
  tertiary_content: {
    key: "tertiary_content",
    chineseName: "第三级内容",
    englishName: "tertiary_content",
    meaning: "组件中的弱信息、元信息或低优先级内容。",
  },
  primary_content_item: {
    key: "primary_content_item",
    chineseName: "内容",
    englishName: "content_item",
    meaning: "一个内容项。",
  },
  secondary_content_item: {
    key: "secondary_content_item",
    chineseName: "内容",
    englishName: "content_item",
    meaning: "一个二级内容项。",
  },
  tertiary_content_item: {
    key: "tertiary_content_item",
    chineseName: "内容",
    englishName: "content_item",
    meaning: "一个三级内容项。",
  },
  primary_actions: {
    key: "primary_actions",
    chineseName: "第一级行动",
    englishName: "primary_actions",
    meaning: "组件中最重要、最需要突出展示的用户操作。",
  },
  secondary_actions: {
    key: "secondary_actions",
    chineseName: "第二级行动",
    englishName: "secondary_actions",
    meaning: "组件中的辅助操作或低优先级操作。",
  },
  danger_actions: {
    key: "danger_actions",
    chineseName: "危险行动",
    englishName: "danger_actions",
    meaning: "删除、禁用、撤销等可能产生破坏性后果的操作。",
  },
  primary_action_item: {
    key: "primary_action_item",
    chineseName: "行动",
    englishName: "action_item",
    meaning: "一个主要操作项。",
  },
  secondary_action_item: {
    key: "secondary_action_item",
    chineseName: "行动",
    englishName: "action_item",
    meaning: "一个次要操作项。",
  },
  danger_action_item: {
    key: "danger_action_item",
    chineseName: "行动",
    englishName: "action_item",
    meaning: "一个危险操作项。",
  },
  style_rules: {
    key: "style_rules",
    chineseName: "样式规则",
    englishName: "style_rules",
    meaning: "该组件具体的视觉样式、状态展示、响应式表现和可访问性规则。",
  },
  style_rule: {
    key: "style_rule",
    chineseName: "规则",
    englishName: "style_rule",
    meaning: "一条组件样式规则。",
  },
} as const;

export const uiDesignLegacySections = [
  { key: "version_summary", title: "当前版本摘要" },
  { key: "visual_hierarchy", title: "视觉层级" },
  { key: "layout_guidelines", title: "布局规则" },
  { key: "component_style_rules", title: "组件样式规则" },
  { key: "badge_rules", title: "Badge 规则" },
  { key: "button_rules", title: "按钮规则" },
  { key: "form_rules", title: "表单规则" },
  { key: "responsive_rules", title: "响应式规则" },
  { key: "accessibility_visual_rules", title: "可访问性视觉规则" },
];
