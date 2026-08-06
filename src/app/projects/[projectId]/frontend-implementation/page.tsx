"use client";

import { CompositeVersionedAssetPage } from "@/components/design-assets/CompositeVersionedAssetPage";
import { listFrontendPageStructures } from "@/lib/api/frontend-page-structures";
import { listFrontendToolings } from "@/lib/api/frontend-toolings";

export default function FrontendImplementationPage() {
  return (
    <CompositeVersionedAssetPage
      title="前端工程实现"
      description="查看前端页面结构、目录结构、路由定义、代码逻辑、环境变量、设计主题和依赖包。"
      groups={[
        {
          key: "frontend-pages",
          title: "前端页面结构",
          description: "查看页面、路由、目录结构和组件组织方式。",
          emptyDescription: "暂无前端页面结构版本。执行涉及前端页面的变更集后会在这里显示。",
          listAssets: listFrontendPageStructures,
          sections: [
            { key: "version_summary", title: "版本摘要" },
            { key: "pages", title: "页面列表" },
            { key: "directory_structure", title: "目录结构" },
            { key: "diff", title: "版本差异" },
          ],
        },
        {
          key: "frontend-tools",
          title: "前端依赖与工具",
          description: "查看前端依赖、内部工具、安装命令和设计相关附加信息。",
          emptyDescription: "暂无前端依赖与工具版本。执行涉及前端工具链的变更集后会在这里显示。",
          listAssets: listFrontendToolings,
          sections: [
            { key: "dependencies", title: "依赖包" },
            { key: "internal_utilities", title: "内部工具" },
            { key: "install_commands", title: "安装命令" },
            { key: "diff", title: "版本差异" },
          ],
        },
      ]}
    />
  );
}
