import {
    Smartphone, Wifi, Cpu, Layers, LayoutGrid, Monitor,
    Headphones, Camera, Watch, Gamepad, Server, Search,
    Settings, Wrench, Shield, Globe, Zap, Database, Code,
    FileText, Image, Video, Music, ShoppingCart
} from 'lucide-react';

// Map of available icons for categories
// Used in Admin (IconPicker) and Frontend (Header, Home)
export const CATEGORY_ICONS: Record<string, any> = {
    smartphone: Smartphone,
    wifi: Wifi,
    cpu: Cpu,
    apps: Layers,
    default: LayoutGrid,
    monitor: Monitor,
    headphones: Headphones,
    camera: Camera,
    watch: Watch,
    gamepad: Gamepad,
    server: Server,
    search: Search,
    settings: Settings,
    tool: Wrench, // Changed from Tool to Wrench
    shield: Shield,
    globe: Globe,
    zap: Zap,
    database: Database,
    code: Code,
    content: FileText,
    image: Image,
    video: Video,
    music: Music,
    cart: ShoppingCart
};
