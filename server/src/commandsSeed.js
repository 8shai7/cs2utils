// Built-in curated CS2 (Source 2) command catalog. Used to seed the database and
// as a fallback when no remote COMMANDS_SOURCE_URL is configured/reachable.

export const CATEGORIES = [
  { id: 'launch', name: 'Launch options' },
  { id: 'fps', name: 'Performance & FPS' },
  { id: 'net', name: 'Networking' },
  { id: 'telemetry', name: 'Telemetry / Net graph' },
  { id: 'hud', name: 'HUD & viewmodel' },
  { id: 'audio', name: 'Audio' },
  { id: 'practice', name: 'Practice & utility' },
  { id: 'other', name: 'Other' },
];

export const RECOMMENDED_LAUNCH_OPTIONS = '-console -novid -nojoy +fps_max 0';

export const SEED_COMMANDS = [
  { key: 'lo-console', category: 'launch', type: 'launch', command: '-console', title: 'Open console on launch', description: 'Starts the game with the developer console already enabled and open.' },
  { key: 'lo-novid', category: 'launch', type: 'launch', command: '-novid', title: 'Skip intro video', description: 'Skips the Valve intro movie for a faster boot into the menu.' },
  { key: 'lo-nojoy', category: 'launch', type: 'launch', command: '-nojoy', title: 'Disable joystick', description: 'Disables controller/joystick support, freeing a small amount of memory.' },
  { key: 'lo-high', category: 'launch', type: 'launch', command: '-high', title: 'High CPU priority', description: 'Starts CS2 at high process priority. Can help low-end systems, but may cause instability on some setups — test it.' },
  { key: 'lo-fpsmax', category: 'launch', type: 'launch', command: '+fps_max 0', title: 'Uncap FPS at launch', description: 'Runs the fps_max console command on launch to remove the default frame cap. Replace 0 with e.g. 300 if you get stutters.' },
  { key: 'lo-softparticles', category: 'launch', type: 'launch', command: '-softparticlesdefaultoff', title: 'Disable soft particles', description: 'Turns off particle/background blending for a small performance gain.' },
  { key: 'lo-fancyblending', category: 'launch', type: 'launch', command: '+mat_disable_fancy_blending 1', title: 'Disable fancy blending', description: 'Simplifies texture blending — slightly lower fidelity for smoother frames.' },
  { key: 'lo-exec-autoexec', category: 'launch', type: 'launch', command: '+exec autoexec', title: 'Run your autoexec', description: 'Executes autoexec.cfg (in the CS2 cfg folder) on launch so your settings stick.' },
  { key: 'lo-fullscreen', category: 'launch', type: 'launch', command: '-fullscreen', title: 'Force fullscreen', description: 'Forces the game to start in fullscreen mode.' },
  { key: 'lo-low-latency', category: 'launch', type: 'launch', command: '+engine_low_latency_sleep_after_client_tick true', title: 'Low-latency frame pacing', description: 'Adjusts when the engine sleeps between frames to reduce input latency. Best paired with a fixed fps_max (not 0).' },

  { key: 'fps-max', category: 'fps', type: 'console', command: 'fps_max 0', title: 'Max FPS cap', description: 'Sets the FPS limit; 0 removes the cap. A fixed cap (e.g. 300) often gives smoother frame pacing than uncapped.' },
  { key: 'fps-max-ui', category: 'fps', type: 'console', command: 'fps_max_ui 120', title: 'Menu FPS cap', description: 'Caps FPS in menus to keep the GPU cool and quiet when not in a match.' },
  { key: 'cl-showfps', category: 'fps', type: 'console', command: 'cl_showfps 1', title: 'Simple FPS counter', description: 'Shows a lightweight FPS counter. 2 adds frame time, 3 adds server timing.' },
  { key: 'r-drawtracers-fp', category: 'fps', type: 'console', command: 'r_drawtracers_firstperson 0', title: 'Hide first-person tracers', description: 'Removes your own bullet tracers to reduce visual clutter.' },

  { key: 'net-rate', category: 'net', type: 'console', command: 'rate 786432', title: 'Bandwidth rate', description: 'Sets the max bandwidth for game traffic. 786432 suits most modern connections; lower it only if your connection is unstable.' },
  { key: 'net-problem-auto', category: 'net', type: 'console', command: 'cq_netgraph_problem_show_auto 1', title: 'Auto connection warning', description: 'Shows a HUD warning automatically when CS2 detects network problems.' },
  { key: 'net-buffer-ticks', category: 'net', type: 'console', command: 'cl_net_buffer_ticks 1', title: 'Small network buffer', description: 'Adds a tiny buffer that can smooth out jitter at the cost of a hair of latency.' },

  { key: 'tel-frametime', category: 'telemetry', type: 'console', command: 'cl_hud_telemetry_frametime_show 2', title: 'Frame time / FPS overlay', description: 'Always shows frame time in the HUD (0 off, 1 only when poor, 2 always).' },
  { key: 'tel-ping', category: 'telemetry', type: 'console', command: 'cl_hud_telemetry_ping_show 2', title: 'Ping overlay', description: 'Always shows your ping in the HUD.' },
  { key: 'tel-misdelivery', category: 'telemetry', type: 'console', command: 'cl_hud_telemetry_net_misdelivery_show 2', title: 'Packet loss overlay', description: 'Shows the percentage of missed user commands and server snapshots — the real "lag" indicator.' },
  { key: 'tel-quality-graph', category: 'telemetry', type: 'console', command: 'cl_hud_telemetry_net_quality_graph_show 2', title: 'Jitter / loss graph', description: 'Displays a graph of packet jitter and loss/reordering.' },
  { key: 'tel-recvmargin', category: 'telemetry', type: 'console', command: 'cl_hud_telemetry_serverrecvmargin_graph_show 2', title: 'Server receive margin graph', description: 'Shows how early/late your commands arrive at the server.' },

  { key: 'hud-scaling', category: 'hud', type: 'console', command: 'hud_scaling 0.85', title: 'HUD scale', description: 'Scales the HUD size (0.5–0.95). Smaller keeps the screen cleaner.' },
  { key: 'cl-radar-scale', category: 'hud', type: 'console', command: 'cl_radar_scale 0.4', title: 'Radar zoom', description: 'Zooms the radar out (0.25–1.0) so you can see more of the map.' },
  { key: 'cl-radar-centered', category: 'hud', type: 'console', command: 'cl_radar_always_centered 0', title: 'Non-centered radar', description: 'Keeps the whole map visible instead of always centering on you.' },
  { key: 'vm-fov', category: 'hud', type: 'console', command: 'viewmodel_fov 68', title: 'Viewmodel FOV', description: 'Widens the weapon viewmodel field of view (54–68).' },
  { key: 'vm-offset', category: 'hud', type: 'console', command: 'viewmodel_offset_x 2.5; viewmodel_offset_y 2; viewmodel_offset_z -2', title: 'Viewmodel position', description: 'Moves the weapon model out of the way for a clearer view.' },

  { key: 'snd-menu', category: 'audio', type: 'console', command: 'snd_menumusic_volume 0', title: 'Mute menu music', description: 'Silences the main-menu music.' },
  { key: 'snd-mvp', category: 'audio', type: 'console', command: 'snd_mvpmusic_volume 0.2', title: 'Lower MVP music', description: 'Turns down the loud MVP anthem so it does not blow your ears out.' },
  { key: 'snd-roundstart', category: 'audio', type: 'console', command: 'snd_roundstart_volume 0.3', title: 'Lower round-start sound', description: 'Reduces the round-start sting for more consistent audio levels.' },
  { key: 'voice-scale', category: 'audio', type: 'console', command: 'voice_scale 0.6', title: 'Voice chat volume', description: 'Sets the volume of other players\u2019 voice chat relative to the game.' },

  { key: 'prac-svcheats', category: 'practice', type: 'console', command: 'sv_cheats 1', title: 'Enable cheats (practice)', description: 'Required on your own practice server to use the commands below.' },
  { key: 'prac-infinite-ammo', category: 'practice', type: 'console', command: 'sv_infinite_ammo 1', title: 'Infinite ammo', description: 'Never reload or run out — great for spray/nade practice.' },
  { key: 'prac-nade-limit', category: 'practice', type: 'console', command: 'ammo_grenade_limit_total 5', title: 'Carry all grenades', description: 'Lets you hold every grenade type at once for lineup practice.' },
  { key: 'prac-traj', category: 'practice', type: 'console', command: 'sv_grenade_trajectory_time 10', title: 'Show nade trajectories', description: 'Draws grenade flight paths for the given seconds.' },
  { key: 'prac-showimpacts', category: 'practice', type: 'console', command: 'sv_showimpacts 1', title: 'Show bullet impacts', description: 'Marks where your shots land (client/server) for spray control practice.' },
  { key: 'prac-buytime', category: 'practice', type: 'console', command: 'mp_buytime 9999; mp_maxmoney 60000; mp_startmoney 60000', title: 'Unlimited buy', description: 'Lets you buy anything, anytime on a practice server.' },
  { key: 'prac-roundtime', category: 'practice', type: 'console', command: 'mp_roundtime 60; mp_roundtime_defuse 60; mp_restartgame 1', title: 'Long practice rounds', description: 'Sets very long rounds and restarts so you can practice uninterrupted.' },
  { key: 'prac-bot-kick', category: 'practice', type: 'console', command: 'bot_kick', title: 'Kick all bots', description: 'Removes bots from your practice server.' },
];
