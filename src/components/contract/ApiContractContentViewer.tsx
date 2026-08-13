import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { JsonViewer } from "@/components/common/JsonViewer";
import { ApiContractViewer } from "@/components/contract/ApiContractViewer";
import {
  ApiContractFieldBlock,
  ApiContractFieldHeading,
} from "@/components/contract/ApiContractFieldDefinition";
import {
  apiContractFieldDefinitions,
} from "@/lib/api-contract-contract";
import {
  isNewApiContractContent,
  type ApiContractDraft,
  type NewApiContractContent,
} from "@/lib/types/api-contract";

function TextValue({ value }: { value: unknown }) {
  return (
    <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
      {String(value ?? "暂无")}
    </p>
  );
}

function JsonBlock({ value }: { value: unknown }) {
  return (
    <pre className="max-h-80 overflow-auto rounded-lg border border-border/60 bg-muted/40 p-3 text-xs leading-6">
      {JSON.stringify(value ?? {}, null, 2)}
    </pre>
  );
}

function NewApiContractContentView({
  contract,
  content,
}: {
  contract: ApiContractDraft;
  content: NewApiContractContent;
}) {
  const groups = Array.isArray(content.api_resource_groups) ? content.api_resource_groups : [];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle>{contract.title}</CardTitle>
              <CardDescription>{contract.summary}</CardDescription>
            </div>
            <Badge>v{contract.version}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ApiContractFieldBlock definition={apiContractFieldDefinitions.api_base_path}>
            <Badge variant="outline" className="font-mono">
              {content.api_base_path || contract.base_path}
            </Badge>
          </ApiContractFieldBlock>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <ApiContractFieldHeading definition={apiContractFieldDefinitions.api_resource_groups} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {groups.length > 0 ? (
            groups.map((group, groupIndex) => (
              <section key={`${group.group_name}-${groupIndex}`} className="space-y-4 rounded-lg border border-border/60 bg-background/70 p-4">
                <ApiContractFieldHeading definition={apiContractFieldDefinitions.api_resource_group} />
                <div className="grid gap-4 md:grid-cols-2">
                  <ApiContractFieldBlock definition={apiContractFieldDefinitions.group_name}>
                    <TextValue value={group.group_name} />
                  </ApiContractFieldBlock>
                  <ApiContractFieldBlock definition={apiContractFieldDefinitions.group_purpose}>
                    <TextValue value={group.group_purpose} />
                  </ApiContractFieldBlock>
                </div>

                <ApiContractFieldBlock definition={apiContractFieldDefinitions.endpoints}>
                  <div className="space-y-3">
                    {group.endpoints.length > 0 ? (
                      group.endpoints.map((endpoint, endpointIndex) => (
                        <div key={`${endpoint.http_method}-${endpoint.endpoint_path}-${endpointIndex}`} className="space-y-4 rounded-lg border border-border/60 bg-muted/30 p-4">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <ApiContractFieldHeading definition={apiContractFieldDefinitions.endpoint} />
                            <Badge variant="outline">{endpoint.http_method}</Badge>
                          </div>
                          <div className="grid gap-4 md:grid-cols-2">
                            <ApiContractFieldBlock definition={apiContractFieldDefinitions.http_method}>
                              <TextValue value={endpoint.http_method} />
                            </ApiContractFieldBlock>
                            <ApiContractFieldBlock definition={apiContractFieldDefinitions.endpoint_path}>
                              <TextValue value={endpoint.endpoint_path} />
                            </ApiContractFieldBlock>
                            <ApiContractFieldBlock definition={apiContractFieldDefinitions.endpoint_purpose}>
                              <TextValue value={endpoint.endpoint_purpose} />
                            </ApiContractFieldBlock>
                            <ApiContractFieldBlock definition={apiContractFieldDefinitions.requires_auth}>
                              <TextValue value={endpoint.requires_auth ? "是" : "否"} />
                            </ApiContractFieldBlock>
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <ApiContractFieldBlock definition={apiContractFieldDefinitions.request_schema}>
                              <JsonBlock value={endpoint.request_schema} />
                            </ApiContractFieldBlock>
                            <ApiContractFieldBlock definition={apiContractFieldDefinitions.response_schema}>
                              <JsonBlock value={endpoint.response_schema} />
                            </ApiContractFieldBlock>
                          </div>

                          <ApiContractFieldBlock definition={apiContractFieldDefinitions.error_model}>
                            <div className="space-y-3">
                              {endpoint.error_model.length > 0 ? (
                                endpoint.error_model.map((errorCase, errorIndex) => (
                                  <div key={`${errorCase.error_code}-${errorIndex}`} className="space-y-3 rounded-lg border border-border/60 bg-background p-4">
                                    <ApiContractFieldHeading definition={apiContractFieldDefinitions.error_case} />
                                    <div className="grid gap-4 md:grid-cols-2">
                                      <ApiContractFieldBlock definition={apiContractFieldDefinitions.error_status_code}>
                                        <TextValue value={errorCase.status_code} />
                                      </ApiContractFieldBlock>
                                      <ApiContractFieldBlock definition={apiContractFieldDefinitions.error_code}>
                                        <TextValue value={errorCase.error_code} />
                                      </ApiContractFieldBlock>
                                      <ApiContractFieldBlock definition={apiContractFieldDefinitions.error_message}>
                                        <TextValue value={errorCase.error_message} />
                                      </ApiContractFieldBlock>
                                      <ApiContractFieldBlock definition={apiContractFieldDefinitions.recovery_suggestion}>
                                        <TextValue value={errorCase.recovery_suggestion || "暂无"} />
                                      </ApiContractFieldBlock>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm leading-6 text-muted-foreground">暂无错误模式</p>
                              )}
                            </div>
                          </ApiContractFieldBlock>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm leading-6 text-muted-foreground">暂无接口</p>
                    )}
                  </div>
                </ApiContractFieldBlock>
              </section>
            ))
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">暂无 API 资源分组</p>
          )}
        </CardContent>
      </Card>

      <JsonViewer data={contract} title="完整 API Contract JSON" />
    </div>
  );
}

function LegacyApiContractContentView({ contract }: { contract: ApiContractDraft }) {
  return (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          这是历史 API 内容结构，保留兼容读取。新版资产会使用 API 前缀、API 资源分组、接口和错误模式契约。
        </AlertDescription>
      </Alert>
      <ApiContractViewer contract={contract} />
    </div>
  );
}

export function ApiContractContentViewer({ contract }: { contract: ApiContractDraft }) {
  if (isNewApiContractContent(contract.content)) {
    return <NewApiContractContentView contract={contract} content={contract.content} />;
  }

  return <LegacyApiContractContentView contract={contract} />;
}
