import React from 'react';
import { Button } from './button';

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative mx-2">
        <h2 className="text-lg font-bold mb-2">{title}</h2>
        <p className="text-gray-700 mb-6">{description}</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>{cancelText}</Button>
          <Button variant="destructive" onClick={onConfirm}>{confirmText}</Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog; 