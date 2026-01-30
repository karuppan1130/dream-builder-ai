import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      nav: {
        home: 'Home',
        dashboard: 'Dashboard',
        projects: 'Projects',
        editor: 'Blueprint Editor',
        viewer: '3D Viewer',
        settings: 'Settings',
        login: 'Login',
        signup: 'Sign Up',
        logout: 'Logout',
      },
      // Landing page
      landing: {
        title: 'AI-Powered Building Planning',
        subtitle: 'Transform your vision into reality with intelligent 3D architectural design',
        cta: 'Start Planning',
        ctaSecondary: 'Watch Demo',
        features: {
          blueprint: {
            title: 'Smart Blueprints',
            desc: 'AI generates optimized floor plans based on your requirements',
          },
          editor: {
            title: 'Interactive Editor',
            desc: 'Drag, resize, and customize rooms with real-time preview',
          },
          model3d: {
            title: '3D Visualization',
            desc: 'Explore your building in immersive 3D before construction',
          },
          voice: {
            title: 'Voice Assistant',
            desc: 'Control the entire platform with multilingual voice commands',
          },
        },
        stats: {
          projects: 'Projects Created',
          users: 'Active Users',
          satisfaction: 'Satisfaction Rate',
        },
      },
      // Dashboard
      dashboard: {
        welcome: 'Welcome back',
        newProject: 'New Project',
        recentProjects: 'Recent Projects',
        quickActions: 'Quick Actions',
        analytics: 'Analytics',
        noProjects: 'No projects yet. Create your first building plan!',
      },
      // Project form
      form: {
        title: 'Create New Project',
        projectName: 'Project Name',
        buildingType: 'Building Type',
        landWidth: 'Land Width (m)',
        landLength: 'Land Length (m)',
        floors: 'Number of Floors',
        rooms: 'Number of Rooms',
        style: 'Architectural Style',
        generate: 'Generate Blueprint',
        cancel: 'Cancel',
        buildingTypes: {
          house: 'Residential House',
          apartment: 'Apartment Building',
          office: 'Office Building',
          hospital: 'Hospital',
          school: 'School',
          warehouse: 'Warehouse',
          hotel: 'Hotel',
          restaurant: 'Restaurant',
        },
        styles: {
          modern: 'Modern',
          traditional: 'Traditional',
          minimalist: 'Minimalist',
          industrial: 'Industrial',
        },
      },
      // Editor
      editor: {
        title: 'Blueprint Editor',
        rooms: 'Rooms',
        addRoom: 'Add Room',
        deleteRoom: 'Delete Room',
        roomTypes: {
          bedroom: 'Bedroom',
          bathroom: 'Bathroom',
          kitchen: 'Kitchen',
          living: 'Living Room',
          dining: 'Dining Room',
          office: 'Office',
          storage: 'Storage',
          garage: 'Garage',
          balcony: 'Balcony',
          hallway: 'Hallway',
        },
        save: 'Save Blueprint',
        export: 'Export SVG',
        view3d: 'View in 3D',
        undo: 'Undo',
        redo: 'Redo',
        zoom: 'Zoom',
        pan: 'Pan',
        select: 'Select',
      },
      // 3D Viewer
      viewer: {
        title: '3D Building Viewer',
        rotate: 'Rotate',
        zoom: 'Zoom',
        pan: 'Pan',
        reset: 'Reset View',
        walkthrough: 'Start Walkthrough',
        download: 'Download Model',
        floor: 'Floor',
        hideWalls: 'Hide Walls',
        showDimensions: 'Show Dimensions',
      },
      // Voice Assistant
      voice: {
        listening: 'Listening...',
        speak: 'Speak a command',
        processing: 'Processing...',
        commands: {
          help: 'Say "help" for available commands',
          examples: 'Examples: "Add bedroom", "Show 3D view", "Change language to Tamil"',
        },
      },
      // Common
      common: {
        loading: 'Loading...',
        error: 'An error occurred',
        success: 'Success!',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        create: 'Create',
        search: 'Search',
        filter: 'Filter',
        sort: 'Sort',
        language: 'Language',
      },
    },
  },
  ta: {
    translation: {
      // Navigation
      nav: {
        home: 'முகப்பு',
        dashboard: 'டாஷ்போர்டு',
        projects: 'திட்டங்கள்',
        editor: 'வரைபட திருத்தி',
        viewer: '3D காட்சி',
        settings: 'அமைப்புகள்',
        login: 'உள்நுழை',
        signup: 'பதிவு செய்',
        logout: 'வெளியேறு',
      },
      // Landing page
      landing: {
        title: 'AI-இயக்கப்படும் கட்டிட திட்டமிடல்',
        subtitle: 'புத்திசாலி 3D கட்டிடக்கலை வடிவமைப்புடன் உங்கள் கனவை நனவாக்குங்கள்',
        cta: 'திட்டமிடலைத் தொடங்கு',
        ctaSecondary: 'டெமோ பார்',
        features: {
          blueprint: {
            title: 'ஸ்மார்ட் வரைபடங்கள்',
            desc: 'உங்கள் தேவைகளின் அடிப்படையில் AI உகந்த தள திட்டங்களை உருவாக்குகிறது',
          },
          editor: {
            title: 'ஊடாடும் திருத்தி',
            desc: 'நிகழ்நேர முன்னோட்டத்துடன் அறைகளை இழுத்து, அளவை மாற்றவும்',
          },
          model3d: {
            title: '3D காட்சிப்படுத்தல்',
            desc: 'கட்டுமானத்திற்கு முன் உங்கள் கட்டிடத்தை 3D-இல் ஆராயுங்கள்',
          },
          voice: {
            title: 'குரல் உதவியாளர்',
            desc: 'பல மொழி குரல் கட்டளைகளுடன் முழு தளத்தையும் கட்டுப்படுத்துங்கள்',
          },
        },
        stats: {
          projects: 'உருவாக்கப்பட்ட திட்டங்கள்',
          users: 'செயலில் உள்ள பயனர்கள்',
          satisfaction: 'திருப்தி விகிதம்',
        },
      },
      // Dashboard
      dashboard: {
        welcome: 'மீண்டும் வரவேற்கிறோம்',
        newProject: 'புதிய திட்டம்',
        recentProjects: 'சமீபத்திய திட்டங்கள்',
        quickActions: 'விரைவு செயல்கள்',
        analytics: 'பகுப்பாய்வு',
        noProjects: 'இன்னும் திட்டங்கள் இல்லை. உங்கள் முதல் கட்டிட திட்டத்தை உருவாக்குங்கள்!',
      },
      // Project form
      form: {
        title: 'புதிய திட்டத்தை உருவாக்கு',
        projectName: 'திட்டப் பெயர்',
        buildingType: 'கட்டிட வகை',
        landWidth: 'நில அகலம் (மீ)',
        landLength: 'நில நீளம் (மீ)',
        floors: 'தளங்களின் எண்ணிக்கை',
        rooms: 'அறைகளின் எண்ணிக்கை',
        style: 'கட்டிடக்கலை பாணி',
        generate: 'வரைபடத்தை உருவாக்கு',
        cancel: 'ரத்து செய்',
        buildingTypes: {
          house: 'குடியிருப்பு வீடு',
          apartment: 'அடுக்குமாடி கட்டிடம்',
          office: 'அலுவலக கட்டிடம்',
          hospital: 'மருத்துவமனை',
          school: 'பள்ளி',
          warehouse: 'கிடங்கு',
          hotel: 'ஹோட்டல்',
          restaurant: 'உணவகம்',
        },
        styles: {
          modern: 'நவீன',
          traditional: 'பாரம்பரிய',
          minimalist: 'எளிமையான',
          industrial: 'தொழில்துறை',
        },
      },
      // Editor
      editor: {
        title: 'வரைபட திருத்தி',
        rooms: 'அறைகள்',
        addRoom: 'அறை சேர்',
        deleteRoom: 'அறை நீக்கு',
        roomTypes: {
          bedroom: 'படுக்கையறை',
          bathroom: 'குளியலறை',
          kitchen: 'சமையலறை',
          living: 'வாழ்க்கை அறை',
          dining: 'சாப்பாட்டு அறை',
          office: 'அலுவலகம்',
          storage: 'சேமிப்பு',
          garage: 'கேரேஜ்',
          balcony: 'பால்கனி',
          hallway: 'நடைபாதை',
        },
        save: 'வரைபடத்தை சேமி',
        export: 'SVG ஏற்றுமதி',
        view3d: '3D-இல் காண்க',
        undo: 'செயல்தவிர்',
        redo: 'மீண்டும்செய்',
        zoom: 'பெரிதாக்கு',
        pan: 'நகர்த்து',
        select: 'தேர்வு',
      },
      // 3D Viewer
      viewer: {
        title: '3D கட்டிட காட்சி',
        rotate: 'சுழற்று',
        zoom: 'பெரிதாக்கு',
        pan: 'நகர்த்து',
        reset: 'மீட்டமை',
        walkthrough: 'நடைப்பயணம் தொடங்கு',
        download: 'மாதிரியை பதிவிறக்கு',
        floor: 'தளம்',
        hideWalls: 'சுவர்களை மறை',
        showDimensions: 'பரிமாணங்களை காட்டு',
      },
      // Voice Assistant
      voice: {
        listening: 'கேட்கிறது...',
        speak: 'கட்டளையை சொல்லுங்கள்',
        processing: 'செயலாக்குகிறது...',
        commands: {
          help: 'கிடைக்கும் கட்டளைகளுக்கு "உதவி" என்று சொல்லுங்கள்',
          examples: 'எடுத்துக்காட்டுகள்: "படுக்கையறை சேர்", "3D காட்சி காட்டு"',
        },
      },
      // Common
      common: {
        loading: 'ஏற்றுகிறது...',
        error: 'பிழை ஏற்பட்டது',
        success: 'வெற்றி!',
        save: 'சேமி',
        cancel: 'ரத்து',
        delete: 'நீக்கு',
        edit: 'திருத்து',
        create: 'உருவாக்கு',
        search: 'தேடு',
        filter: 'வடிகட்டு',
        sort: 'வரிசைப்படுத்து',
        language: 'மொழி',
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
