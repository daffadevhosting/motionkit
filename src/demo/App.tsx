import { useState } from 'react'
import { Button, Card, CardHeader, CardTitle, CardContent, Modal, Toggle, Avatar, AvatarGroup, Badge, BadgeGroup, Alert } from '../index'
import { AnimationConfig } from '../hooks/useAnimation'

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [toggleEnabled, setToggleEnabled] = useState(false)

  const buttonAnimation: AnimationConfig = {
    type: 'bounce',
    trigger: 'onHover',
    duration: 500
  }

  const cardAnimation: AnimationConfig = {
    type: 'slideUp',
    trigger: 'onView',
    duration: 1000
  }

  return (
    <div className="p-8 space-y-6 min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Component demos in grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* Animated Buttons */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Buttons</h2>
          <div className="space-x-2">
            <Button animateOn={buttonAnimation}>
              Hover Me!
            </Button>
            <Button variant="outline" ripple={true}>
              Click for Ripple
            </Button>
            <Button loading={true}>
              Loading...
            </Button>
          </div>
        </div>

        {/* Avatars */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Avatars</h2>
          <div className="flex items-center space-x-4">
            <Avatar size="sm" fallback="JD" />
            <Avatar size="md" fallback="MS" />
            <Avatar size="lg" fallback="AS" />
            <Avatar size="xl" fallback="US" />
          </div>
          <div className="mt-4">
            <AvatarGroup max={3}>
              <Avatar fallback="JD" />
              <Avatar fallback="MS" />
              <Avatar fallback="AS" />
              <Avatar fallback="US" />
            </AvatarGroup>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Badges</h2>
          <div className="space-x-2">
            <Badge variant="default">Default</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="ghost">Ghost</Badge>
          </div>
          <div className="mt-4">
            <BadgeGroup>
              <Badge variant="primary">React</Badge>
              <Badge variant="secondary">TypeScript</Badge>
              <Badge variant="outline">Vite</Badge>
            </BadgeGroup>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Alerts</h2>
          <div className="space-y-3">
            <Alert variant="info" title="Info Alert" description="This is an info message" />
            <Alert variant="success" title="Success Alert" description="This is a success message" />
            <Alert
              variant="warning"
              title="Warning Alert"
              description="This is a warning message"
              closable
              onClose={() => {}}
            />
            <Alert variant="destructive" title="Destructive Alert" description="This is a destructive message" />
          </div>
        </div>

        {/* Animated Cards */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Animated Components</h2>
          <Card
            animateOn={cardAnimation}
            hover="lift"
            staggerChildren
            className="max-w-md inline-block mr-6"
          >
            <CardHeader>
              <CardTitle>Animated Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p>This card animates when it comes into view!</p>
              <Toggle
                enabled={toggleEnabled}
                onChange={setToggleEnabled}
                className="mt-4"
              />
            </CardContent>
          </Card>

          {/* Modal Trigger */}
          <div className="inline-block">
            <Button onClick={() => setIsModalOpen(true)}>
              Open Modal
            </Button>

            {/* Animated Modal */}
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            >
              <CardHeader>
                <CardTitle>Animated Modal</CardTitle>
              </CardHeader>
              <CardContent>
                <p>This modal has smooth entrance and exit animations!</p>
                <Button onClick={() => setIsModalOpen(false)} className="mt-4">
                  Close
                </Button>
              </CardContent>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App