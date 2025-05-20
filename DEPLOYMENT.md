# Helland Family Calendar Dashboard - Deployment Guide

This guide provides instructions for deploying the Helland Family Calendar Dashboard application on a Raspberry Pi 4.

## System Requirements

- Raspberry Pi 4 (2GB RAM minimum, 4GB recommended)
- Micro SD card (16GB minimum)
- Raspberry Pi OS (Bullseye or newer)
- Node.js 18.x or higher
- Connected display (27" monitor recommended)
- Internet connection for calendar syncing

## Installation Instructions

### 1. Set Up Raspberry Pi

1. Download and install Raspberry Pi OS using the Raspberry Pi Imager
2. During setup, configure WiFi and enable SSH for remote access
3. Boot the Pi and complete the initial setup

### 2. Install Required Dependencies

```bash
# Update package lists
sudo apt update
sudo apt upgrade -y

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node -v
npm -v

# Install git
sudo apt install -y git
```

### 3. Clone and Set Up the Application

```bash
# Create directory for the application
mkdir -p ~/helland-calendar
cd ~/helland-calendar

# Clone the repository
git clone https://github.com/yourusername/helland-family-calendar.git .

# Install dependencies
npm install

# Build the application
npm run build
```

### 4. Create Environment Variables (if needed)

Create a `.env` file in the root directory:

```bash
touch .env
```

Edit the file to include any necessary environment variables:

```
# Example environment variables
WEATHER_API_KEY=your_api_key_here
PHOTO_DIRECTORY=/home/pi/photos
```

### 5. Configure Auto-Start on Boot

Create a systemd service:

```bash
sudo nano /etc/systemd/system/helland-calendar.service
```

Add the following content:

```
[Unit]
Description=Helland Family Calendar Dashboard
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/helland-calendar
ExecStart=/usr/bin/node dist/index.js
Restart=on-failure
Environment=NODE_ENV=production
Environment=PORT=5000

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo systemctl enable helland-calendar.service
sudo systemctl start helland-calendar.service
```

### 6. Configure Auto-Launch in Browser

Create a script to launch Chromium in kiosk mode:

```bash
mkdir -p ~/.config/autostart
nano ~/.config/autostart/calendar-kiosk.desktop
```

Add the following content:

```
[Desktop Entry]
Type=Application
Name=Calendar Kiosk
Exec=chromium-browser --kiosk --disable-restore-session-state --noerrdialogs --disable-pinch --disable-session-crashed-bubble http://localhost:5000
```

### 7. Optimize Raspberry Pi Settings

Disable screen blanking:

```bash
sudo nano /etc/xdg/lxsession/LXDE-pi/autostart
```

Add the following lines:

```
@xset s off
@xset -dpms
@xset s noblank
```

### 8. Additional Configuration

#### Photo Directory Setup

Create a directory for photos:

```bash
mkdir -p ~/photos
```

Configure this path in the application settings panel.

#### Calendar Setup

1. Access the dashboard at `http://localhost:5000`
2. Click the settings gear icon
3. Add family members and their calendar URLs
4. Configure meal calendar URL
5. Adjust other settings as needed

## Maintenance

### Updating the Application

```bash
cd ~/helland-calendar
git pull
npm install
npm run build
sudo systemctl restart helland-calendar.service
```

### Checking Logs

```bash
sudo journalctl -u helland-calendar.service
```

### Restarting the Service

```bash
sudo systemctl restart helland-calendar.service
```

## Troubleshooting

### Application Not Starting

Check the service status:

```bash
sudo systemctl status helland-calendar.service
```

### Calendar Not Syncing

- Verify internet connection
- Check calendar URLs in settings
- Ensure calendar permissions are set to public

### Display Issues

- Check monitor connection
- Adjust resolution settings: `sudo raspi-config`

### Screen Goes Black After Inactivity

Make sure screen blanking is disabled:

```bash
@xset s off
@xset -dpms
@xset s noblank
```

## Support

For additional support or to report issues, please file a ticket on the GitHub repository or contact the maintainer.