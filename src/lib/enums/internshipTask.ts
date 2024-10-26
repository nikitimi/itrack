import { z } from 'zod';

export type InternshipTask = z.infer<typeof internshipTaskEnum>;

const internshipTaskEnum = z.enum([
  'REQUIREMENT_GATHERING',
  'DATA_ANALYSIS',
  'PROCESS_DOCUMENTATION',
  'STAKEHOLDER_COMMUNICATION',
  'MARKET_RESEARCH',
  'USER_ACCEPTANCE_TESTING_(UAT)',
  'BUSINESS_PROCESS_MODELING',
  'SWOT_ANALYSIS',
  'COST-BENEFIT_ANALYSIS',
  'DOCUMENTATION_MANAGEMENT',
  'REPORT_AUTOMATION',
  'WEB_DEVELOPER_ASSISTANT',
  'FRONT-END_DEVELOPMENT',
  'BACK-END_DEVELOPMENT',
  'DATABASE_MANAGEMENT',
  'API_INTEGRATION',
  'TESTING_AND_DEBUGGING',
  'MOBILE_APP_DEVELOPMENT',
  'RESPONSIVE_DESIGN_IMPLEMENTATION',
  'VERSION_CONTROL_MANAGEMENT',
  'UI/UX_DESIGN_SUPPORT',
  'PLUGIN/EXTENSION_DEVELOPMENT',
  'CONTENT_MANAGEMENT_SYSTEM_(CMS)_CUSTOMIZATION',
  'SEO_OPTIMIZATION',
  'CLOUD_INTEGRATION',
  'CROSS-PLATFORM_MOBILE_DEVELOPMENT',
  'INCIDENT_MANAGEMENT',
  'CHANGE_MANAGEMENT',
  'SERVICE_DESK_SUPPORT',
  'IT_ASSET_MANAGEMENT',
  'VENDOR_COORDINATION',
  'DOCUMENTATION_OF_IT_PROCESSES',
  'MONITORING_AND_REPORTING',
  'PROBLEM_MANAGEMENT',
  'CAPACITY_MANAGEMENT',
  'SERVICE_LEVEL_AGREEMENT_(SLA)_MONITORING',
  'IT_COMPLIANCE_AUDITS',
  'SERVICE_IMPROVEMENT_PLANNING',
  'DISASTER_RECOVERY_PLANNING',
  'CONFIGURATION_MANAGEMENT_DATABASE_(CMDB)',
]);

export default internshipTaskEnum;
