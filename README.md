# Job Application Tracker

A full-stack web application to help job seekers capture, organize, and manage their entire job search in one centralized place � powered by a beautiful, drag-and-drop Kanban board.

> **Live Demo:** _Add your deployed URL here_
> **GitHub:** _Add your repo URL here_

---

## 1. Features

### 1.1 Authentication
- **Email & Password sign-up / sign-in** powered by [Better Auth](https://better-auth.com)
- Secure session management with cookie caching (1-hour TTL)
- Protected routes � unauthenticated users are redirected to `/sign-in`
- On first sign-up, a personal **"Job Hunt" Kanban board is automatically created** for the user with 5 default columns

### 1.2 Kanban Board (Dashboard)
- **Visual Kanban board** with 5 default pipeline stages:
  - ?? **Wish List** � Jobs you want to apply to
  - ?? **Applied** � Applications submitted
  - ?? **Interviewing** � Active interview process
  - ?? **Offer** � Received an offer
  - ?? **Rejected** � Archived rejections
- Each column displays job cards with position, company, tags, description, and a direct link to the job posting
- Column headers are color-coded with icons for quick visual scanning

### 1.3 Drag & Drop
- Full **drag-and-drop** functionality using [`@dnd-kit`](https://dndkit.com)
- Drag job cards **within a column** to reorder them
- Drag job cards **across columns** to update their pipeline status
- **Optimistic UI updates** � the board reflects changes instantly while saving to the database in the background
- A **drag overlay ghost** previews the card being dragged

### 1.4 Create Job Applications
- Click the **"+" button** inside any column to open a dialog
- Fill in:
  - Company name *(required)*
  - Position/role *(required)*
  - Location
  - Salary range (e.g., `$100k - $150k`)
  - Job posting URL
  - Tags (comma-separated, e.g., `React, Remote, High Pay`)
  - Description
  - Personal notes
- Automatically assigned an order index so it appears at the bottom of the column

### 1.5 Edit Job Applications
- Click the **? menu** on any job card ? **Edit**
- Edit all fields: company, position, location, salary, job URL, tags, description, notes
- Changes are saved and the board re-validates via Next.js `revalidatePath`

### 1.6 Move Between Columns (via Menu)
- Click the **? menu** on any card ? **Move to [Column Name]**
- Quickly move a card to any other column without dragging

### 1.7 Delete Job Applications
- Click the **? menu** on any card ? **Delete**
- Card is removed from the column and permanently deleted from the database

### 1.8 Landing Page
- Clean marketing landing page with:
  - Hero section with a CTA to sign up
  - Image tabs preview of the product
  - Feature highlights: Organize, Track Progress, Stay Organized

### 1.9 User Avatar & Sign Out
- Navbar shows the user's **avatar with initials** and **email**
- Dropdown in the navbar allows **sign out**

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Authentication** | [Better Auth](https://better-auth.com/) |
| **Database** | [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/) |
| **Drag & Drop** | [@dnd-kit/core + @dnd-kit/sortable](https://dndkit.com/) |
| **Server Actions** | Next.js Server Actions (no separate API needed) |
| **Animations** | [tw-animate-css](https://www.npmjs.com/package/tw-animate-css) |

---

## 3. Database Schema

### `Board`
| Field | Type | Description |
|---|---|---|
| `name` | String | Board name (default: "Job Hunt") |
| `userId` | String | Owner's user ID |
| `columns` | ObjectId[] | References to Column documents |

### `Column`
| Field | Type | Description |
|---|---|---|
| `name` | String | Column label (e.g., "Applied") |
| `order` | Number | Display order |
| `boardId` | ObjectId | Reference to parent Board |
| `jobApplications` | ObjectId[] | References to JobApplication documents |

### `JobApplication`
| Field | Type | Description |
|---|---|---|
| `company` | String | Company name *(required)* |
| `position` | String | Role/job title *(required)* |
| `location` | String | Job location |
| `status` | String | Application status (default: `"applied"`) |
| `columnId` | ObjectId | Parent column |
| `boardId` | ObjectId | Parent board |
| `userId` | String | Owner |
| `order` | Number | Sort order within the column |
| `notes` | String | Personal notes |
| `salary` | String | Salary range |
| `jobUrl` | String | Link to the job posting |
| `appliedDate` | Date | Date of application |
| `tags` | String[] | Custom tags |
| `description` | String | Job description |

---

## 4. Getting Started (Local Development)

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- A [MongoDB](https://www.mongodb.com/atlas) database (MongoDB Atlas free tier works)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/job-application-tracker.git
cd job-application-tracker
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the project root:

```env
# MongoDB connection string
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/job-tracker

# Better Auth secret (generate with: openssl rand -base64 32)
BETTER_AUTH_SECRET=your_super_secret_key_here

# The public URL of your app
BETTER_AUTH_URL=http://localhost:3000
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---
