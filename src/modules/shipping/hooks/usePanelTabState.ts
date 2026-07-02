import { useState } from "react";

export function usePanelTabState<T>(onClose: () => void) {
  const [activeTab, setActiveTab] = useState(0);
  const [editingItem, setEditingItem] = useState<T | null>(null);

  const handleEdit = (item: T) => {
    setEditingItem(item);
    setActiveTab(1);
  };

  const handleFormSuccess = (refetch: () => void) => {
    setEditingItem(null);
    setActiveTab(0);
    refetch();
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    if (newValue === 1 && activeTab !== 1) setEditingItem(null);
  };

  const handleClose = () => {
    setEditingItem(null);
    setActiveTab(0);
    onClose();
  };

  return { activeTab, editingItem, handleEdit, handleFormSuccess, handleTabChange, handleClose };
}
