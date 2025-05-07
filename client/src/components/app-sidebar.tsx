// AppSidebar.tsx
import { useTranslation } from 'react-i18next';
import * as React from 'react';
import {
  AudioWaveform,
  BookOpen,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  Users,
  Network,
  FileBarChart2,
  Wrench,
} from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import { NavProjects } from '@/components/nav-projects';
import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { useAuth } from '../context/Auth-context'; // Adjust the import path

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation();
  const { user, logout } = useAuth(); // Get authenticated user and logout function

  // Sample data for teams and navigation
  const data = {
    teams: [
      {
        name: "Acme Inc",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
      },
      {
        name: "Acme Corp.",
        logo: AudioWaveform,
        plan: "Startup",
      },
      {
        name: "Evil Corp.",
        logo: Command,
        plan: "Free",
      },
    ],
    navMain: [
      {
        title: t("sidebar.organizational_structure"),
        url: "#",
        icon: Network,
        isActive: true,
        items: [
          {
            title: t("sidebar.faculties"),
            url: "/organizational-structure/faculties",
          },
          {
            title: t("sidebar.departments"),
            url: "/organizational-structure/departments",
          },
          {
            title: t("sidebar.domains"),
            url: "/organizational-structure/domains",
          },
          {
            title: t("sidebar.laboratories"),
            url: "/organizational-structure/laboratories",
          },
          {
            title: t("sidebar.teams"),
            url: "/organizational-structure/teams",
          },
        ],
      },
      {
        title: t("sidebar.personnel_management"),
        url: "#",
        icon: Users,
        items: [
          {
            title: t("sidebar.researchers"),
            url: "/personnel-management/researchers",
          },
          {
            title: t("sidebar.doctoral_students"),
            url: "/personnel-management/doctoral-students",
          },
          {
            title: t("sidebar.supervisions"),
            url: "/personnel-management/supervise",
          },{
            title: t("sidebar.functions"),
            url: "/personnel-management/functions",
          },
          {
            title: t("sidebar.specialties"),
            url: "/personnel-management/specialities",
          },
        ],
      },
      {
        title: t("sidebar.publications_management"),
        url: "#",
        icon: BookOpen,
        items: [
          {
            title: t("sidebar.scientific_reviews"),
            url: "/publications-management/scientific-reviews",
          },
          {
            title: t("sidebar.review_specialties"),
            url: "/publications-management/review-specialities",
          },
          {
            title: t("sidebar.publication_categories"),
            url: "/publications-management/publication-categories",
          },
        ],
      },
      {
        title: t("sidebar.research_productions"),
        url: "#",
        icon: FileBarChart2,
        items: [
          {
            title: t("sidebar.publications"),
            url: "/research-productions/publications",
          },
          {
            title: t("sidebar.communications"),
            url: "/research-productions/communications",
          },
          {
            title: t("sidebar.production_types"),
            url: "/research-productions/production-types",
          },
          {
            title: t("sidebar.publishers"),
            url: "/research-productions/publishers",
          },
        ],
      },
      {
        title: t("sidebar.equipment_management"),
        url: "#",
        icon: Wrench,
        items: [
          {
            title: t("sidebar.equipment_inventory"),
            url: "/equipment-management/equipment-inventory",
          },
          {
            title: t("sidebar.researcher_assignments"),
            url: "/equipment-management/assign-researcher",
          },
          {
            title: t("sidebar.student_assignments"),
            url: "/equipment-management/assign-doctoral-student",
          },
        ],
      },
      {
        title: "Settings",
        url: "#",
        icon: Settings2,
        items: [
          {
            title: "General",
            url: "#",
          },
          {
            title: "Team",
            url: "#",
          },
          {
            title: "Billing",
            url: "#",
          },
          {
            title: "Limits",
            url: "#",
          },
        ],
      },
    ],
    projects: [
      {
        name: "Design Engineering",
        url: "#",
        icon: Frame,
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: PieChart,
      },
      {
        name: "Travel",
        url: "#",
        icon: Map,
      },
    ],
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        {/* Pass the authenticated user and logout function to NavUser */}
        <NavUser user={user} logout={logout} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}