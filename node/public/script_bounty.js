// Simulated Web3 data (replace with actual Web3.js contract call)
const bountyData = [
    { 
        projectName: "Ethereum DeFi Project", 
        taskName: "Add css page", 
        bountyAmount: 1,
        claimed: true
    },
    { 
        projectName: "Solana NFT Platform", 
        taskName: "Neaten up html", 
        bountyAmount: 15,
        claimed: false
    },
    { 
        projectName: "Polygon Gaming Dapp", 
        taskName: "Game Mechanics Implementation", 
        bountyAmount: 50,
        claimed: false
    },
    { 
        projectName: "Cardano Governance Tool", 
        taskName: "Backend API Development", 
        bountyAmount: 200,
        claimed: false
    }
];

function renderBounties(filteredBounties) {
    const bountyList = document.getElementById('bountyList');
    
    // Keep the header, remove other existing entries
    const header = bountyList.querySelector('.bounty-header');
    bountyList.innerHTML = '';
    bountyList.appendChild(header);

    filteredBounties.forEach(bounty => {
        const bountyItem = document.createElement('div');
        bountyItem.className = 'bounty-item';
        bountyItem.innerHTML = `
            <div class="bounty-col-1">$${bounty.bountyAmount}</div>
            <div class="bounty-col-2">${bounty.projectName}</div>
            <div class="bounty-col-3">${bounty.taskName}</div>
            <div class="bounty-col-4">${bounty.claimed}</div>
        `;
        bountyList.appendChild(bountyItem);
    });
}

function filterBountiesPrice(category) {
    let filtered = bountyData;
    
    switch(category) {
        case 'low':
            filtered = bountyData.filter(b => b.bountyAmount < 10);
            break;
        case 'medium':
            filtered = bountyData.filter(b => b.bountyAmount >= 10 && b.bountyAmount < 100);
            break;
        case 'high':
            filtered = bountyData.filter(b => b.bountyAmount >= 100);
            break;
    }

    renderBounties(filtered);
}

function filterBountiesClaimed(category) {
  let filtered = bountyData;
  
  switch(category) {
      case 'claimed':
          filtered = bountyData.filter(b => b.claimed);
          break;
      case 'unclaimed':
          filtered = bountyData.filter(b => !b.claimed);
          break;
  }

  renderBounties(filtered);
}

// Initial render of all bounties
renderBounties(bountyData);
