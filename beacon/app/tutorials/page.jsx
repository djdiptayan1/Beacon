"use client"
import { motion } from 'framer-motion';
import { 
    ShieldCheck, 
    Settings, 
    Mail, 
    Globe, 
    CheckCircle2, 
    AlertTriangle,
    ArrowRight,
    Server
} from 'lucide-react';

const TutorialPage = () => {
    const sections = [
        {
            id: 'ses-setup',
            title: '1. Set up SES Account',
            icon: <Mail className="w-6 h-6 text-blue-600" />,
            content: (
                <div className="space-y-4">
                    <p className="text-gray-600">Amazon Simple Email Service (SES) is the engine behind Beacon. First, you'll need an AWS account.</p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600">
                        <li>Log in to your <a href="https://console.aws.amazon.com/ses" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">AWS Console</a>.</li>
                        <li>Search for <strong>Amazon SES</strong> in the services search bar.</li>
                        <li>Select the region closest to your audience (e.g., US East (N. Virginia) or Mumbai).</li>
                    </ul>
                    <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-bold text-amber-900">Sandbox Mode</h4>
                            <p className="text-sm text-amber-800">New accounts start in "Sandbox Mode". You can only send emails to verified identities. To send to anyone, you must request "Production Access" in the SES console.</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'identities',
            title: '2. Verify Identities',
            icon: <Globe className="w-6 h-6 text-blue-600" />,
            content: (
                <div className="space-y-4">
                    <p className="text-gray-600">You must prove you own the domain or email address you want to send from.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="p-4 border border-gray-100 rounded-xl bg-gray-50">
                            <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                                <Globe className="w-4 h-4 mr-2" /> Domain Verification
                            </h4>
                            <p className="text-sm text-gray-600 mb-3">Best for sending from any address like @yourdomain.com.</p>
                            <ol className="text-xs space-y-1 text-gray-500 list-decimal pl-4">
                                <li>Click "Verified Identities" &gt; "Create Identity".</li>
                                <li>Select "Domain" and enter your domain name.</li>
                                <li>AWS will provide CNAME records. Add these to your DNS provider (Cloudflare, GoDaddy, etc.).</li>
                                <li>Wait for status to become "Verified".</li>
                            </ol>
                        </div>
                        <div className="p-4 border border-gray-100 rounded-xl bg-gray-50">
                            <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                                <Mail className="w-4 h-4 mr-2" /> Email Verification
                            </h4>
                            <p className="text-sm text-gray-600 mb-3">Best for quick testing or personal use.</p>
                            <ol className="text-xs space-y-1 text-gray-500 list-decimal pl-4">
                                <li>Click "Verified Identities" &gt; "Create Identity".</li>
                                <li>Select "Email address" and enter your email.</li>
                                <li>Check your inbox and click the verification link from AWS.</li>
                                <li>The status will update to "Verified".</li>
                            </ol>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'iam-permissions',
            title: '3. IAM & Permissions',
            icon: <ShieldCheck className="w-6 h-6 text-blue-600" />,
            content: (
                <div className="space-y-4">
                    <p className="text-gray-600">Beacon needs programmatic access to your AWS account to send emails on your behalf.</p>
                    <ol className="list-decimal pl-5 space-y-3 text-gray-600">
                        <li>Navigate to <strong>IAM</strong> (Identity and Access Management) in AWS.</li>
                        <li>Go to <strong>Users</strong> &gt; <strong>Create User</strong>.</li>
                        <li>Set a name (e.g., <code className="bg-gray-100 px-1 rounded text-pink-600">BeaconUser</code>).</li>
                        <li>In "Set permissions", create or attach a <strong>least-privilege policy</strong> instead of using <strong>"AmazonSESFullAccess"</strong>.</li>
                        <li>Grant only the SES permissions Beacon needs, such as <code className="bg-gray-100 px-1 rounded text-pink-600">ses:SendEmail</code>, <code className="bg-gray-100 px-1 rounded text-pink-600">ses:SendRawEmail</code>, and <code className="bg-gray-100 px-1 rounded text-pink-600">ses:GetSendQuota</code>, scoped to your required region and verified identities where possible.</li>
                    </ol>
                    <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-300">
                        <p>{`{`}</p>
                        <p>&nbsp;&nbsp;<span className="text-blue-400">"Version"</span>: <span className="text-green-400">"2012-10-17"</span>,</p>
                        <p>&nbsp;&nbsp;<span className="text-blue-400">"Statement"</span>: [</p>
                        <p>&nbsp;&nbsp;&nbsp;&nbsp;{`{`}</p>
                        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-400">"Effect"</span>: <span className="text-green-400">"Allow"</span>,</p>
                        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-400">"Action"</span>: [</p>
                        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">"ses:SendEmail"</span>,</p>
                        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">"ses:SendRawEmail"</span>,</p>
                        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">"ses:GetSendQuota"</span></p>
                        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;],</p>
                        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-400">"Resource"</span>: <span className="text-green-400">"*"</span></p>
                        <p>&nbsp;&nbsp;&nbsp;&nbsp;{`}`}</p>
                        <p>&nbsp;&nbsp;]</p>
                        <p>{`}`}</p>
                    </div>
                    <p className="text-gray-600">After attaching the policy, complete user creation. Then open the user's <strong>"Security credentials"</strong> tab.</p>
                    <p className="text-gray-600">Click <strong>"Create access key"</strong>, select "Application running outside AWS", and save your <strong>Access Key ID</strong> and <strong>Secret Access Key</strong>.</p>
                </div>
            )
        },
        {
            id: 'envs',
            title: '4. Environment Variables',
            icon: <Settings className="w-6 h-6 text-blue-600" />,
            content: (
                <div className="space-y-4">
                    <p className="text-gray-600">Now, connect Beacon to your AWS account by adding the keys to your <code className="bg-gray-100 px-1 rounded text-pink-600">.env</code> file.</p>
                    <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-300">
                        <p className="text-gray-500"># .env</p>
                        <p><span className="text-blue-400">AWS_ACCESS_KEY_ID</span>=your_access_key_here</p>
                        <p><span className="text-blue-400">AWS_SECRET_ACCESS_KEY</span>=your_secret_key_here</p>
                        <p><span className="text-blue-400">AWS_SES_REGION</span>=us-east-1 <span className="text-gray-500"># or your chosen region</span></p>
                    </div>
                </div>
            )
        },
        {
            id: 'smtp',
            title: '5. SMTP Setup (Optional)',
            icon: <Server className="w-6 h-6 text-blue-600" />,
            content: (
                <div className="space-y-4">
                    <p className="text-gray-600">While Beacon uses the AWS SDK for performance, you might want SMTP credentials for other integrations.</p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600">
                        <li>In SES Console, go to <strong>"SMTP Settings"</strong>.</li>
                        <li>Note down the <strong>SMTP Endpoint</strong> (e.g., <code className="bg-gray-100 px-1 rounded">email-smtp.us-east-1.amazonaws.com</code>).</li>
                        <li>Click <strong>"Create SMTP credentials"</strong>.</li>
                        <li>This will generate a unique SMTP username and password (different from IAM keys).</li>
                    </ul>
                </div>
            )
        }
    ];

    return (
        <main className="min-h-screen bg-white pb-20 pt-24">
            {/* Background Decoration */}
            <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6">
                {/* Header */}
                <div className="mb-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6"
                    >
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
                            Configuration Guide
                        </span>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl font-bold tracking-tight text-gray-900 mb-6"
                    >
                        Setting up <span className="text-blue-600">Beacon</span>
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-gray-500 max-w-2xl mx-auto"
                    >
                        Follow this step-by-step guide to configure Amazon SES and connect it to your Beacon instance for high-performance mailing.
                    </motion.p>
                </div>

                {/* Steps */}
                <div className="space-y-12">
                    {sections.map((section, index) => (
                        <motion.section
                            key={section.id}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="relative pl-12 md:pl-16 border-l-2 border-gray-100 pb-4"
                        >
                            {/* Step Number Circle */}
                            <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center z-10">
                                <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                            </div>

                            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center space-x-3 mb-6">
                                    {section.icon}
                                    <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                                </div>
                                <div className="space-y-6">
                                    {section.content}
                                </div>
                            </div>
                        </motion.section>
                    ))}
                </div>

                {/* Final Note */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20 p-8 rounded-3xl bg-gray-900 text-white relative overflow-hidden"
                >
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-4">Ready to send?</h3>
                        <p className="text-gray-400 mb-8 max-w-xl">
                            Once you've configured your environment variables, restart your application and you're ready to start your first campaign.
                        </p>
                        <a 
                            href="/" 
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-colors group"
                        >
                            Go to Dashboard
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Mail className="w-32 h-32" />
                    </div>
                </motion.div>
            </div>
        </main>
    );
};

export default TutorialPage;