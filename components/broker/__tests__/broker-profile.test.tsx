import { render, screen } from '@testing-library/react';
import BrokerProfile from '../broker-profile';

const mockBrokerData = {
  id: 1,
  created_at: '2023-01-01',
  name: 'Test Broker',
  source: 'test',
  website: 'https://testbroker.com',
  logo: '/test-logo.png',
  image: null,
  description: 'A test broker for testing purposes',
  summary: 'Test broker summary',
  rating: '4.5',
  year_published: '2010',
  headquarters: 'Test City',
  country: 'Test Country',
  offices: ['Test Office 1', 'Test Office 2'],
  employees: 100,
  address: '123 Test St, Test City',
  regulators: ['Test Regulator'],
  licenses: ['Test License'],
  is_regulated: true,
  instruments: ['Forex', 'Stocks', 'Crypto'],
  spread_eur_usd: '1.2',
  leverage_max: '1:500',
  account_types: ['Standard', 'VIP'],
  base_currencies: ['USD', 'EUR', 'GBP'],
  platforms: ['MT4', 'MT5', 'Web'],
  deposit_methods: ['Bank Transfer', 'Credit Card', 'Crypto'],
  withdraw_methods: ['Bank Transfer', 'Credit Card', 'Crypto'],
  min_deposit: '100',
  min_withdrawl: '50',
  deposit_fees: '0%',
  withdrawal_fees: '0%',
  deposit_process_time: 'Instant',
  withdrawal_process_time: '1-3 business days',
  languages: ['English', 'Spanish', 'French'],
  availability: '24/5',
  channels: ['Email', 'Live Chat', 'Phone'],
  phone_numbers: ['+1234567890', '+0987654321'],
  email: 'support@testbroker.com',
  response_time: '24 hours',
  pros: ['Low fees', 'Good customer support', 'Wide range of instruments'],
  cons: ['Limited educational resources', 'No 24/7 support']
};

describe('BrokerProfile', () => {
  it('renders broker information correctly', () => {
    render(<BrokerProfile brokerData={mockBrokerData} relatedBrokers={[]} />);
    
    // Check if the broker name is rendered
    expect(screen.getByText('Test Broker Review')).toBeInTheDocument();
    
    // Check if the rating is rendered
    expect(screen.getByText('4.5')).toBeInTheDocument();
    
    // Check if the summary is rendered
    expect(screen.getByText('Test broker summary')).toBeInTheDocument();
    
    // Check if the visit button is rendered with correct link
    const visitButton = screen.getByRole('link', { name: /visit test broker/i });
    expect(visitButton).toBeInTheDocument();
    expect(visitButton).toHaveAttribute('href', 'https://testbroker.com');
    
    // Check if the minimum deposit is rendered
    expect(screen.getByText('Minimum Deposit')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    
    // Check if the leverage is rendered
    expect(screen.getByText('Maximum Leverage')).toBeInTheDocument();
    expect(screen.getByText('1:500')).toBeInTheDocument();
    
    // Check if the spread is rendered
    expect(screen.getByText('EUR/USD Spread')).toBeInTheDocument();
    expect(screen.getByText('1.2')).toBeInTheDocument();
    
    // Check if the account types are rendered
    expect(screen.getByText('Account Types')).toBeInTheDocument();
    expect(screen.getByText('Standard, VIP')).toBeInTheDocument();
    
    // Check if the base currencies are rendered
    expect(screen.getByText('Base Currencies')).toBeInTheDocument();
    expect(screen.getByText('USD, EUR, GBP')).toBeInTheDocument();
    
    // Check if the regulators are rendered
    expect(screen.getByText('Regulators')).toBeInTheDocument();
    expect(screen.getByText('Test Regulator')).toBeInTheDocument();
    
    // Check if the licenses are rendered
    expect(screen.getByText('Licenses')).toBeInTheDocument();
    expect(screen.getByText('Test License')).toBeInTheDocument();
    
    // Check if the headquarters is rendered
    expect(screen.getByText('Headquarters')).toBeInTheDocument();
    expect(screen.getByText('Test City')).toBeInTheDocument();
    
    // Check if the email is rendered
    expect(screen.getByText('support@testbroker.com')).toBeInTheDocument();
    
    // Check if the phone number is rendered
    expect(screen.getByText('+1234567890')).toBeInTheDocument();
    
    // Check if the address is rendered
    expect(screen.getByText('123 Test St, Test City')).toBeInTheDocument();
    
    // Check if the deposit methods are rendered
    expect(screen.getByText('Deposit Methods')).toBeInTheDocument();
    expect(screen.getByText('Bank Transfer')).toBeInTheDocument();
    expect(screen.getByText('Credit Card')).toBeInTheDocument();
    expect(screen.getByText('Crypto')).toBeInTheDocument();
    
    // Check if the withdrawal methods are rendered
    expect(screen.getByText('Withdrawal Methods')).toBeInTheDocument();
    
    // Check if the pros are rendered
    expect(screen.getByText('Pros')).toBeInTheDocument();
    expect(screen.getByText('Low fees')).toBeInTheDocument();
    expect(screen.getByText('Good customer support')).toBeInTheDocument();
    expect(screen.getByText('Wide range of instruments')).toBeInTheDocument();
    
    // Check if the cons are rendered
    expect(screen.getByText('Cons')).toBeInTheDocument();
    expect(screen.getByText('Limited educational resources')).toBeInTheDocument();
    expect(screen.getByText('No 24/7 support')).toBeInTheDocument();
  });
  
  it('handles missing optional data gracefully', () => {
    const minimalBrokerData = {
      ...mockBrokerData,
      logo: '',
      deposit_fees: null,
      withdrawal_fees: null,
      phone_numbers: [],
      pros: [],
      cons: []
    };
    
    render(<BrokerProfile brokerData={minimalBrokerData} relatedBrokers={[]} />);
    
    // Check if N/A is shown for missing phone number
    expect(screen.getByText('N/A')).toBeInTheDocument();
    
    // Check if default messages are shown for missing pros and cons
    expect(screen.getByText('No pros available')).toBeInTheDocument();
    expect(screen.getByText('No cons available')).toBeInTheDocument();
  });
});
