import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ProjectInput } from '@/lib/blueprintGenerator';

interface ProjectFormProps {
  onSubmit: (data: ProjectInput) => void;
  onCancel: () => void;
}

const ProjectForm = ({ onSubmit, onCancel }: ProjectFormProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<ProjectInput>({
    projectName: '',
    buildingType: 'house',
    landWidth: 20,
    landLength: 25,
    floors: 1,
    numberOfRooms: 5,
    style: 'modern',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const buildingTypes = [
    { value: 'house', label: t('form.buildingTypes.house') },
    { value: 'apartment', label: t('form.buildingTypes.apartment') },
    { value: 'office', label: t('form.buildingTypes.office') },
    { value: 'hospital', label: t('form.buildingTypes.hospital') },
    { value: 'school', label: t('form.buildingTypes.school') },
    { value: 'warehouse', label: t('form.buildingTypes.warehouse') },
    { value: 'hotel', label: t('form.buildingTypes.hotel') },
    { value: 'restaurant', label: t('form.buildingTypes.restaurant') },
  ];

  const styles = [
    { value: 'modern', label: t('form.styles.modern') },
    { value: 'traditional', label: t('form.styles.traditional') },
    { value: 'minimalist', label: t('form.styles.minimalist') },
    { value: 'industrial', label: t('form.styles.industrial') },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-lg bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[hsl(222,47%,11%)] px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">{t('form.title')}</h2>
          <Button variant="ghost" size="icon" onClick={onCancel} className="text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="projectName">{t('form.projectName')}</Label>
            <Input
              id="projectName"
              value={formData.projectName}
              onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
              placeholder="My Dream Home"
              required
            />
          </div>

          {/* Building Type */}
          <div className="space-y-2">
            <Label>{t('form.buildingType')}</Label>
            <Select
              value={formData.buildingType}
              onValueChange={(value) => setFormData({ ...formData, buildingType: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {buildingTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Land Dimensions */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="landWidth">{t('form.landWidth')}</Label>
              <Input
                id="landWidth"
                type="number"
                min={5}
                max={100}
                value={formData.landWidth}
                onChange={(e) => setFormData({ ...formData, landWidth: Number(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="landLength">{t('form.landLength')}</Label>
              <Input
                id="landLength"
                type="number"
                min={5}
                max={100}
                value={formData.landLength}
                onChange={(e) => setFormData({ ...formData, landLength: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          {/* Floors and Rooms */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="floors">{t('form.floors')}</Label>
              <Input
                id="floors"
                type="number"
                min={1}
                max={10}
                value={formData.floors}
                onChange={(e) => setFormData({ ...formData, floors: Number(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numberOfRooms">{t('form.rooms')}</Label>
              <Input
                id="numberOfRooms"
                type="number"
                min={1}
                max={20}
                value={formData.numberOfRooms}
                onChange={(e) => setFormData({ ...formData, numberOfRooms: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          {/* Style */}
          <div className="space-y-2">
            <Label>{t('form.style')}</Label>
            <Select
              value={formData.style}
              onValueChange={(value) => setFormData({ ...formData, style: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {styles.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
              {t('form.cancel')}
            </Button>
            <Button type="submit" variant="hero" className="flex-1">
              {t('form.generate')}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ProjectForm;
