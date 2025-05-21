// Mock data for demonstration
const mockEmails = [
  {
    id: '1',
    subject: 'Urgent: Project Deadline Update',
    sender: 'project.manager@company.com',
    importance: 'high' as const,
    needsResponse: true,
  },
  {
    id: '2',
    subject: 'Meeting Notes from Yesterday',
    sender: 'team.lead@company.com',
    importance: 'medium' as const,
    needsResponse: false,
  },
  {
    id: '3',
    subject: 'New Feature Request',
    sender: 'product.manager@company.com',
    importance: 'high' as const,
    needsResponse: true,
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock function to check emails
export const mockCheckEmails = async () => {
  await delay(1500); // Simulate network delay
  return mockEmails;
};

// Mock function to draft a response
export const mockDraftResponse = async (emailId: string) => {
  await delay(1000); // Simulate network delay
  const email = mockEmails.find(e => e.id === emailId);
  
  if (!email) {
    throw new Error('Email not found');
  }

  return {
    emailId,
    draft: `Thank you for your email regarding "${email.subject}". I've reviewed the information and would like to discuss this further. Could we schedule a brief call to go over the details?`,
    suggestedActions: [
      'Schedule a meeting',
      'Request more information',
      'Provide immediate response',
    ],
  };
};

// Mock function to send email
export const mockSendEmail = async (emailId: string, content: string) => {
  await delay(800); // Simulate network delay
  return {
    success: true,
    message: 'Email sent successfully',
  };
};

// Mock function to edit draft
export const mockEditDraft = async (emailId: string, newContent: string) => {
  await delay(500); // Simulate network delay
  return {
    success: true,
    draft: newContent,
  };
}; 