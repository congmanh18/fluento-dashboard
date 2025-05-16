<template>
  <q-drawer
    :model-value="modelValue"
    @update:model-value="val => emit('update:modelValue', val)"
    show-if-above
    bordered
    class="bg-primary text-white"
  >
    <q-list>
      <SidebarItem to="/" icon="dashboard" label="Dashboard" />
      <!-- <SidebarItem to="/Dashboard2" icon="dashboard" label="Dashboard2" /> -->
      <!-- <SidebarItem to="/Dashboard3" icon="dashboard" label="Dashboard3" /> -->
      <SidebarGroup icon="people" label="User Management">
          <SidebarItem to="/users/list" icon="list" label="All Users" />
          <SidebarItem to="/users/roles" icon="security" label="Roles & Permissions" />
          <SidebarItem to="/users/invite" icon="person_add_alt" label="Invite User" />
          <SidebarItem to="/users/activity-log" icon="history" label="Activity Logs" />
      </SidebarGroup>
      <SidebarGroup icon="school" label="Content Studio">
          <SidebarItem to="/content/topics" icon="topic" label="Topic & Lesson" />
          <!-- <SidebarItem to="/content/topics2" icon="topic" label="Topic & Lesson 2" /> -->
          <SidebarItem to="/content/dialogs" icon="chat" label="Dialogs" />
          <SidebarItem to="/content/stories" icon="book" label="Stories" />
          <SidebarItem to="/content/vocabulary" icon="spellcheck" label="Vocabulary" />
          <SidebarItem to="/content/karaoke" icon="music_note" label="Karaoke" />
          <SidebarItem to="/content/quiz" icon="quiz" label="Quiz" />
      </SidebarGroup>
      <SidebarGroup icon="translate" label="Content Translation">
          <SidebarItem to="/translate/topics" icon="topic" label="Topics" />
          <SidebarItem to="/translate/lessons" icon="book" label="Lessons" />
          <SidebarItem to="/translate/dialogs" icon="chat" label="Dialogs" />
          <SidebarItem to="/translate/stories" icon="book" label="Stories" />
          <SidebarItem to="/translate/vocabulary" icon="spellcheck" label="Vocabulary" />
          <SidebarItem to="/translate/karaoke" icon="music_note" label="Karaoke" />
          <SidebarItem to="/translate/quiz" icon="quiz" label="Quiz" />
      </SidebarGroup>
      <SidebarGroup icon="image" label="Image Management">
        <SidebarItem to="/images" icon="image" label="Images" />
      </SidebarGroup>

      <SidebarGroup icon="data_object" label="Master Data">
        <SidebarItem to="/master-data/languages" icon="language" label="Languages" />
        <SidebarItem to="/master-data/characters" icon="person" label="Characters" />
      </SidebarGroup>

      <SidebarGroup icon="lock" label="Authentication">
        <SidebarItem to="/auth/login" icon="login" label="Login" />
        <SidebarItem to="/auth/register" icon="person_add" label="Register" />
        <SidebarItem to="/auth/forgot" icon="lock" label="Forgot Password" />
        <SidebarItem to="/auth/reset" icon="lock" label="Reset Password" />
      </SidebarGroup>

      <!-- <SidebarGroup icon="view_in_ar" label="Templates">
          <SidebarItem to="/templates/template1" icon="view_in_ar" label="Template 1" />
          <SidebarItem to="/templates/template2" icon="view_in_ar" label="Template 2" />
          <SidebarItem to="/templates/template3" icon="view_in_ar" label="Template 3" />
          <SidebarItem to="/templates/template4" icon="view_in_ar" label="Template 4" />
      </SidebarGroup> -->
      <!-- <SidebarGroup icon="check_circle" label="Approval Center">
          <SidebarItem to="/approval/pending-topics" icon="hourglass_empty" label="Pending Topics"/>
          <SidebarItem to="/approval/pending-lessons" icon="hourglass_bottom" label="Pending Lessons"/>
          <SidebarItem to="/approval/rejected" icon="cancel" label="Rejected" />
          <SidebarItem to="/approval/history" icon="history" label="Approval History" />
      </SidebarGroup>
        <SidebarGroup icon="folder_open" label="Content Management">
          <SidebarItem to="/organize/create-topic" icon="add_circle" label="Create Topic" />
          <SidebarItem to="/organize/create-lesson" icon="note_add" label="Create Lesson" />
          <SidebarItem to="/organize/batch-import" icon="cloud_upload" label="Batch Import" />
          <SidebarItem to="/organize/reorder-modules" icon="swap_vert" label="Reorder Modules" />
        </SidebarGroup>

        <SidebarGroup icon="rate_review" label="Review Tracking">
          <SidebarItem to="/reviews/pending" icon="pending" label="Pending Reviews" />
          <SidebarItem to="/reviews/reviewed" icon="task_alt" label="Reviewed Items" />
          <SidebarItem to="/reviews/stats" icon="leaderboard" label="Reviewer Stats" />
          <SidebarItem to="/reviews/flagged" icon="report_problem" label="Flagged Content" />
        </SidebarGroup>

        <SidebarGroup icon="inbox" label="Submissions Archive">
          <SidebarItem to="/submissions/all" icon="all_inbox" label="All Submissions" />
          <SidebarItem to="/submissions/mine" icon="account_circle" label="My Submissions" />
          <SidebarItem to="/submissions/search" icon="search" label="Filtered Search" />
          <SidebarItem to="/submissions/export" icon="file_download" label="Export" />
        </SidebarGroup>

        <SidebarGroup icon="bar_chart" label="Reports & Analytics">
          <SidebarItem to="/reports/stats" icon="analytics" label="Content Stats" />
          <SidebarItem to="/reports/contributions" icon="group" label="User Contributions" />
          <SidebarItem to="/reports/system" icon="health_and_safety" label="System Health" />
          <SidebarItem to="/reports/reviews" icon="fact_check" label="Review Logs" />
        </SidebarGroup>

        <SidebarGroup icon="settings" label="System Settings">
          <SidebarItem to="/settings/general" icon="tune" label="General Settings" />
          <SidebarItem to="/settings/access" icon="vpn_key" label="Access Control" />
          <SidebarItem to="/settings/backup" icon="backup" label="Backup & Restore" />
          <SidebarItem to="/settings/email" icon="email" label="Email Config" />
        </SidebarGroup>

        <SidebarGroup icon="code" label="Developer Tools">
          <SidebarItem to="/developer/api" icon="api" label="API Explorer" />
          <SidebarItem to="/developer/logs" icon="bug_report" label="Logs" />
          <SidebarItem to="/developer/seeder" icon="dataset" label="Seeder" />
          <SidebarItem to="/developer/tester" icon="bug_report" label="Data Tester" />
          <SidebarItem to="/developer/webhooks" icon="link" label="Webhooks" />
        </SidebarGroup>

        <SidebarGroup icon="notifications" label="Notifications">
          <SidebarItem to="/notifications/all" icon="notifications_active" label="All Notifications" />
          <SidebarItem to="/notifications/alerts" icon="warning" label="System Alerts" />
          <SidebarItem to="/notifications/feedback" icon="feedback" label="User Feedback" />
          <SidebarItem to="/notifications/unread" icon="mark_email_unread" label="Unread" />
        </SidebarGroup> -->


        <!-- <SidebarGroup icon="menu_book" label="Guidelines & Docs">
          <SidebarItem to="/docs/contributor" icon="edit" label="For Contributor" />
          <SidebarItem to="/docs/reviewer" icon="rule_folder" label="For Reviewer" />
          <SidebarItem to="/docs/style" icon="format_paint" label="Content Style Guide" />
          <SidebarItem to="/docs/technical" icon="code_off" label="Technical Docs" />
        </SidebarGroup>
        <SidebarGroup icon="toggle_on" label="Feature Flags">
          <SidebarItem to="/features/current" icon="track_changes" label="Current Experiments" />
          <SidebarItem to="/features/toggle" icon="toggle_on" label="Toggle Feature" />
          <SidebarItem to="/features/rollout" icon="rocket_launch" label="Rollout Plans" />
          <SidebarItem to="/features/archived" icon="inventory_2" label="Archived Features" />
        </SidebarGroup>
        <SidebarGroup icon="support_agent" label="Feedback & Support">
          <SidebarItem to="/support/feedback" icon="forum" label="User Feedback" />
          <SidebarItem to="/support/contact" icon="contact_support" label="Contact Requests" />
          <SidebarItem to="/support/resolved" icon="check_circle" label="Resolved" />
          <SidebarItem to="/support/faq" icon="help" label="FAQ Editor" />
        </SidebarGroup> -->


        <!-- <SidebarItem to="/tree-table" icon="view_in_ar" label="Tree Table" /> -->
    </q-list>
  </q-drawer>
</template>

<script setup>
import SidebarItem from './SidebarItem.vue'
import SidebarGroup from './SidebarGroup.vue'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
</script>
