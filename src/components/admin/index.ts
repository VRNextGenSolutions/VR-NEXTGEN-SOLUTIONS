/**
 * Admin Components Barrel Export
 */

// Layout
export { AdminLayout } from './layout/AdminLayout';
export { AdminSidebar } from './layout/AdminSidebar';
export { AdminHeader } from './layout/AdminHeader';

// Guards
export { ProtectedRoute } from './guards/ProtectedRoute';

// Dashboard
export { StatCard } from './dashboard/StatCard';
export { QuickActions } from './dashboard/QuickActions';

// Shared
export { DataTable } from './shared/DataTable';
export { ConfirmDialog } from './shared/ConfirmDialog';
export { LoadingSpinner } from './shared/LoadingSpinner';
export { EmptyState } from './shared/EmptyState';

// Posts
export { PostsTable } from './posts/PostsTable';
export { PostForm } from './posts/PostForm';
export { TagInput } from './posts/TagInput';

// Editor
export { MarkdownEditor } from './editor/MarkdownEditor';
export { MarkdownToolbar } from './editor/MarkdownToolbar';
export { MarkdownPreview } from './editor/MarkdownPreview';

// Media
export { ImageUploader } from './media/ImageUploader';

// Comments
export { CommentsTable } from './comments/CommentsTable';

// Subscribers
export { SubscribersTable } from './subscribers/SubscribersTable';
