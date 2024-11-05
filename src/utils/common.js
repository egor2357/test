export const getStaffList = (unitNode) => {
	let result = [];
	if (unitNode)
	{
		if (unitNode.data && unitNode.data.length){
			for (let item of unitNode.data)
			{
				result.push(item)
			}
		}
		if (unitNode.children && unitNode.children.length)
		{
			for (let item of unitNode.children)
			{
				let children = getStaffList(item);
				if (children.length)
				{
					for (let item of children)
					{
						result.push(item)
					}
				}
			}
		}
	}
	return result;
}