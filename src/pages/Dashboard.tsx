import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Plus, 
  FolderOpen, 
  Clock, 
  Building2,
  ArrowRight,
  MoreVertical,
  Eye,
  Trash2,
  Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link, useNavigate } from 'react-router-dom';
import ProjectForm from '@/components/ProjectForm';
import type { Project } from '@/types/blueprint';

// Mock data for demo
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Modern Family Home',
    buildingType: 'house',
    landWidth: 20,
    landLength: 30,
    floors: 2,
    style: 'modern',
    status: 'in_progress',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    name: 'Downtown Office',
    buildingType: 'office',
    landWidth: 40,
    landLength: 50,
    floors: 5,
    style: 'minimalist',
    status: 'completed',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: '3',
    name: 'Community Hospital',
    buildingType: 'hospital',
    landWidth: 60,
    landLength: 80,
    floors: 4,
    style: 'modern',
    status: 'draft',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
  },
];

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showNewProject, setShowNewProject] = useState(false);
  const [projects, setProjects] = useState<Project[]>(mockProjects);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success/20 text-success';
      case 'in_progress':
        return 'bg-accent/20 text-accent';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getBuildingIcon = (type: string) => {
    return Building2;
  };

  const handleCreateProject = (data: any) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: data.projectName,
      buildingType: data.buildingType,
      landWidth: data.landWidth,
      landLength: data.landLength,
      floors: data.floors,
      style: data.style,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProjects([newProject, ...projects]);
    setShowNewProject(false);
    navigate('/editor', { state: { project: newProject } });
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {t('dashboard.welcome')} 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your building projects and create new designs.
            </p>
          </div>
          <Button variant="hero" onClick={() => setShowNewProject(true)} className="gap-2">
            <Plus className="w-5 h-5" />
            {t('dashboard.newProject')}
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Plus, label: 'New Project', action: () => setShowNewProject(true), color: 'bg-accent' },
            { icon: FolderOpen, label: 'Open Recent', action: () => {}, color: 'bg-primary' },
            { icon: Building2, label: 'Templates', action: () => {}, color: 'bg-success' },
            { icon: Clock, label: 'History', action: () => {}, color: 'bg-warning' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={i}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={item.action}
                className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-accent/50 transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-card-foreground">{item.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Projects Grid */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            {t('dashboard.recentProjects')}
          </h2>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </div>

        {projects.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{t('dashboard.noProjects')}</p>
              <Button variant="hero" className="mt-4 gap-2" onClick={() => setShowNewProject(true)}>
                <Plus className="w-4 h-4" />
                Create First Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => {
              const Icon = getBuildingIcon(project.buildingType);
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="group hover:border-accent/50 transition-all duration-300 hover:shadow-lg overflow-hidden">
                    {/* Preview area */}
                    <div className="h-40 bg-[hsl(222,47%,11%)] blueprint-grid relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon className="w-16 h-16 text-[hsl(199,89%,48%)]/30" />
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {project.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(222,47%,11%)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                        <Link to="/editor" state={{ project }}>
                          <Button variant="blueprint" size="sm" className="gap-2">
                            <Eye className="w-4 h-4" />
                            Open Editor
                          </Button>
                        </Link>
                      </div>
                    </div>

                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{project.name}</CardTitle>
                          <CardDescription className="capitalize">
                            {project.buildingType} • {project.floors} floor{project.floors > 1 ? 's' : ''}
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View 3D
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{project.landWidth}m × {project.landLength}m</span>
                        <span>•</span>
                        <span className="capitalize">{project.style}</span>
                      </div>
                      <div className="mt-3 text-xs text-muted-foreground">
                        Updated {project.updatedAt.toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* New Project Modal */}
        {showNewProject && (
          <ProjectForm
            onSubmit={handleCreateProject}
            onCancel={() => setShowNewProject(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
