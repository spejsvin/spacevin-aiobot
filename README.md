# Spacevin's Multipurpose Discord Bot

![Bot Logo](https://your-bot-logo-url-here.png)

A versatile Discord bot designed to enhance server management and user interaction. This bot offers features like slot management, vouching system, and sticky messages.

## Features

### Slot Management
Create and manage temporary channels (slots) for users.

![Slot Configuration](https://cdn.discordapp.com/attachments/1187389819807092868/1333178692616065024/image.png?ex=6797f2e9&is=6796a169&hm=06ad57db1d5bf08ecdbc41fd29301b3344c9ad25a1240408e5b34f180404a505&)

### Vouching System
Allow users to vouch for others, building a reputation system within your server.

![Vouch Creation](https://cdn.discordapp.com/attachments/1187389819807092868/1333179175674052638/image.png?ex=6797f35c&is=6796a1dc&hm=e9e5782855a33d7dbfffeaf58ee1fa574befc3fb7d0b21c35dfff761b91c0b79&)

### Sticky Messages
Pin important messages that reappear after new messages in designated channels.

## Commands

- `/slotconfig`: Configure slot settings
- `/slot`: Create a new slot
- `/vouchconfig`: Set up the vouching system
- `/vouch`: Create a vouch for a user
- `/sticky`: Set up a sticky message

## Setup

1. Clone this repository
2. Install dependencies with `npm install`
3. Create a `.env` file with your Discord bot token and MongoDB URI
4. Run the bot with `node index.js`

## Configuration

Make sure to set up the following environment variables:

- `DISCORD_TOKEN`: Your Discord bot token
- `MONGODB_URI`: Your MongoDB connection string

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Created by Spacevin
- Built with [Discord.js](https://discord.js.org/)
- Database powered by [MongoDB](https://www.mongodb.com/)

