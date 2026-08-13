export type FrontendImplementationFieldDefinition = {
  key: string;
  chineseName: string;
  englishName: string;
  meaning: string;
};

export const frontendImplementationFieldDefinitions = {
  frontend_implementation: {
    key: "frontend_implementation",
    chineseName: "前端工程实现",
    englishName: "frontend_implementation",
    meaning: "将 UX、UI、API 契约转译为前端工程结构和实现规划的资产模块。",
  },
  version_summary: {
    key: "version_summary",
    chineseName: "版本摘要",
    englishName: "version_summary",
    meaning: "本次前端工程实现版本的简要概括。",
  },
  route_definitions: {
    key: "route_definitions",
    chineseName: "路由定义",
    englishName: "route_definitions",
    meaning: "前端访问路径、动态参数、页面归属和权限要求。",
  },
  route_definition: {
    key: "route_definition",
    chineseName: "路由",
    englishName: "route_definition",
    meaning: "一条前端访问路径和页面归属规则。",
  },
  route_path: {
    key: "route_path",
    chineseName: "访问路径",
    englishName: "path",
    meaning: "前端用户访问该页面时使用的 URL 路径。",
  },
  page_name: {
    key: "page_name",
    chineseName: "页面归属",
    englishName: "page_name",
    meaning: "该路由对应的前端页面或产品页面名称。",
  },
  dynamic_params: {
    key: "dynamic_params",
    chineseName: "动态参数",
    englishName: "dynamic_params",
    meaning: "该路由中需要从 URL 中读取的动态参数集合。",
  },
  permission_requirement: {
    key: "permission_requirement",
    chineseName: "权限要求",
    englishName: "permission_requirement",
    meaning: "访问该路由前必须满足的登录、角色或数据权限要求。",
  },
  directory_structure: {
    key: "directory_structure",
    chineseName: "目录结构",
    englishName: "directory_structure",
    meaning: "前端页面、组件、API client、类型定义和工具文件的建议文件路径。",
  },
  directory_entry: {
    key: "directory_entry",
    chineseName: "文件路径",
    englishName: "directory_entry",
    meaning: "一个建议创建或修改的前端文件路径。",
  },
  file_path: {
    key: "file_path",
    chineseName: "路径",
    englishName: "path",
    meaning: "建议文件或目录在前端工程中的位置。",
  },
  file_purpose: {
    key: "file_purpose",
    chineseName: "用途",
    englishName: "purpose",
    meaning: "该文件或目录在前端实现中的职责。",
  },
  code_logic: {
    key: "code_logic",
    chineseName: "代码逻辑",
    englishName: "code_logic",
    meaning: "前端页面和组件中的核心状态、事件、数据流和错误处理逻辑。",
  },
  logic_item: {
    key: "logic_item",
    chineseName: "逻辑对象",
    englishName: "logic_item",
    meaning: "一个页面、组件或 API client 的前端实现逻辑规划。",
  },
  logic_target: {
    key: "logic_target",
    chineseName: "目标对象",
    englishName: "target",
    meaning: "该段代码逻辑对应的页面、组件或前端模块。",
  },
  state_management: {
    key: "state_management",
    chineseName: "核心状态",
    englishName: "state_management",
    meaning: "该目标对象需要维护的主要 UI 状态和业务状态。",
  },
  events: {
    key: "events",
    chineseName: "事件",
    englishName: "events",
    meaning: "用户操作、生命周期或系统事件触发的前端行为。",
  },
  data_flow: {
    key: "data_flow",
    chineseName: "数据流",
    englishName: "data_flow",
    meaning: "前端页面、组件、API client 和后端接口之间的数据流向。",
  },
  error_handling: {
    key: "error_handling",
    chineseName: "错误处理",
    englishName: "error_handling",
    meaning: "请求失败、校验失败、权限失败或空状态时的处理方式。",
  },
  environment_variables: {
    key: "environment_variables",
    chineseName: "环境变量",
    englishName: "environment_variables",
    meaning: "前端运行和构建所需的环境变量配置。",
  },
  environment_variable: {
    key: "environment_variable",
    chineseName: "环境变量项",
    englishName: "environment_variable",
    meaning: "一个前端运行或构建环境变量。",
  },
  env_name: {
    key: "env_name",
    chineseName: "变量名",
    englishName: "name",
    meaning: "环境变量的名称。",
  },
  env_purpose: {
    key: "env_purpose",
    chineseName: "变量用途",
    englishName: "purpose",
    meaning: "该环境变量在前端工程中的用途。",
  },
  env_required: {
    key: "env_required",
    chineseName: "是否必需",
    englishName: "required",
    meaning: "该环境变量是否为运行或构建必需配置。",
  },
  design_theme: {
    key: "design_theme",
    chineseName: "设计主题",
    englishName: "design_theme",
    meaning: "前端工程中承载 UI 视觉系统的主题配置或样式 token。",
  },
  theme_item: {
    key: "theme_item",
    chineseName: "主题项",
    englishName: "theme_item",
    meaning: "一个主题配置、样式 token 或视觉系统落地规则。",
  },
  dependencies: {
    key: "dependencies",
    chineseName: "依赖包",
    englishName: "dependencies",
    meaning: "前端工程需要安装或使用的第三方依赖包。",
  },
  dependency: {
    key: "dependency",
    chineseName: "依赖包项",
    englishName: "dependency",
    meaning: "一个前端第三方依赖包。",
  },
  package_name: {
    key: "package_name",
    chineseName: "包名",
    englishName: "package_name",
    meaning: "第三方依赖包的 npm 包名或工程引用名。",
  },
  dependency_purpose: {
    key: "dependency_purpose",
    chineseName: "依赖用途",
    englishName: "purpose",
    meaning: "该依赖包在前端工程中的使用原因。",
  },
  dependency_required: {
    key: "dependency_required",
    chineseName: "是否必需",
    englishName: "required",
    meaning: "该依赖包是否为实现该前端工程规划的必需依赖。",
  },
} as const;

export const frontendImplementationLegacySections = [
  { key: "version_summary", title: "版本摘要" },
  { key: "pages", title: "历史页面结构（兼容）" },
  { key: "components", title: "历史组件结构（兼容）" },
  { key: "directory_structure", title: "目录结构" },
  { key: "data_flow", title: "数据流" },
  { key: "dependencies", title: "依赖包" },
  { key: "internal_utilities", title: "内部工具" },
  { key: "install_commands", title: "安装命令" },
  { key: "diff", title: "版本差异" },
];
