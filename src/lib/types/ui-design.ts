import type { VersionedDesignAsset } from "@/lib/types/design-asset";

export type ButtonPriority =
  | "primary"
  | "secondary"
  | "ghost"
  | "destructive";

export type UIDesignStyle = {
  style_description: string;
  signature_traits: string[];
};

export type UIThemeTypes = {
  light_mode: string;
  dark_mode: string;
};

export type UIThemeConfiguration = {
  theme_types: UIThemeTypes;
  default_theme: string;
};

export type UIVisualSystem = {
  design_style: UIDesignStyle;
  design_principles: string[];
  theme_configuration: UIThemeConfiguration;
  color_system: string[];
  typography_system: string[];
  spacing_system: string[];
  shape_system: string[];
  elevation_system: string[];
  interaction_visual_system: string[];
};

export type UILayoutRule = {
  target_screen: string;
  desktop_layout: string;
  mobile_layout: string;
};

export type UIVisualPriority = {
  primary_content: string[];
  secondary_content: string[];
  tertiary_content: string[];
  primary_actions: string[];
  secondary_actions: string[];
  danger_actions: string[];
};

export type UIComponentStyleRule = {
  component_name: string;
  visual_priority: UIVisualPriority;
  style_rules: string[];
};

export type NewUIDesignContent = {
  version_summary: string;
  visual_system: UIVisualSystem;
  layout_rules: UILayoutRule[];
  component_style_rules: UIComponentStyleRule[];
  diff: {
    added: unknown[];
    modified: unknown[];
    removed: unknown[];
  };
};

export type LegacyUIDesignContent = {
  version_summary: string;
  visual_hierarchy: Array<{
    target: string;
    rule: string;
  }>;
  layout_guidelines: Array<{
    target: string;
    desktop: string;
    mobile: string;
  }>;
  component_style_rules: Array<{
    component: string;
    rules: string[];
  }>;
  badge_rules: Array<{
    type: string;
    items: Array<{
      value: string;
      label: string;
      visual_intent: string;
    }>;
  }>;
  button_rules: Array<{
    button: string;
    priority: ButtonPriority | string;
    states: string[];
  }>;
  form_rules: Array<{
    target: string;
    rules: string[];
  }>;
  responsive_rules: string[];
  accessibility_visual_rules: string[];
  diff: {
    added: unknown[];
    modified: unknown[];
    removed: unknown[];
  };
};

export type UIDesignContent = NewUIDesignContent | LegacyUIDesignContent;

export type UIDesign = VersionedDesignAsset<UIDesignContent>;

export function isNewUIDesignContent(content: UIDesignContent): content is NewUIDesignContent {
  return "visual_system" in content || "layout_rules" in content;
}
