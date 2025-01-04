import React, { useEffect, useState } from 'react';
import setResponsivePadding from './js/responsive';

const IndexPage = () => {
    const [databaseContent, setDatabaseContent] = useState([]);
    const [titleName, setTitleName] = useState([]);
    const [uniqueTags, setUniqueTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState(null);

    // 过滤数据库内容
    const filterDatabaseContent = (tag) => {
        setSelectedTag(tag);
        // 获取数据库内容
        fetch('/api/getDatabaseContent')
            .then(response => response.json())
            .then(data => {
                const filteredDatabaseContent = tag === '全部' ? data.results : data.results.filter(page => {
                    const pageTag = page.properties.Category.select;
                    return pageTag && pageTag.name === tag;
                });
                setDatabaseContent({ results: filteredDatabaseContent });
            })
            .catch(error => console.error(error));
    }

    useEffect(() => {
        // 获取getUniqueTags的内容
        fetch('/api/getUniqueTags')
            .then(response => response.json())
            .then(data => setUniqueTags(data))
            .catch(error => console.error(error));

        // 获取数据库内容
        fetch('/api/getDatabaseContent')
            .then(response => response.json())
            .then(data => setDatabaseContent(data))
            .catch(error => console.error(error));

        // 获取标题名称
        fetch('/api/getTitleName')
            .then(response => response.json())
            .then(data => setTitleName(data))
            .catch(error => console.error(error));

        // 延迟执行 setResponsivePadding 函数
        const timeoutId = setTimeout(() => {
            setResponsivePadding();
        }, 1000); // 例如，延迟 100 毫秒

        // 添加窗口大小变化的事件监听器
        const handleResize = () => {
            setResponsivePadding();
        };

        window.addEventListener('resize', handleResize);

        // 组件卸载时移除事件监听器和清除定时器
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // 刷新缓存处理函数
    const handleButtonClick = async () => {
        try {
            // 发送 POST 请求到 refreshCache API 路由
            const response = await fetch('/api/getDatabaseContent', {
                method: 'POST',
            });

            if (response.ok) {
                // 缓存刷新成功，可以在此处理刷新后的数据
                console.log('Cache refreshed successfully');
                // 刷新页面
                window.location.reload();
            } else {
                // 缓存刷新失败，可以在此处理错误情况
                console.error('Failed to refresh cache');
            }
        } catch (error) {
            console.error('Failed to send request', error);
        }
    }

    // 渲染页面内容和使用 `databaseContent` 数据
    return (
        <div style={{ display: 'flex' }}>
            <div style={{ width: '200px', borderRight: '1px solid #ccc' }}>
                {/* 标签栏内容 */}
                <h3>标签栏</h3>
                <ul>
                    <li onClick={() => filterDatabaseContent('全部')}>全部</li>
                    {uniqueTags && uniqueTags.map((tag, index) => (
                        <li key={index} onClick={() => filterDatabaseContent(tag)}>{tag}</li>
                    ))}
                </ul>
            </div>
            <div style={{ flex: 1 }}>
                {/* 主内容区域 */}
                <h1>{selectedTag ? `${selectedTag} 的内容` : '主内容'}</h1>
                <div id="cards-container">
                    {/* 这里将显示数据库内容 */}
                    {databaseContent.results && databaseContent.results.map((page, index) => {
                        const imageUrl = 
                            (page.properties.Icons.files && page.properties.Icons.files[0] && page.properties.Icons.files[0].file.url) || 
                            (page.properties.Icons.url ? page.properties.Icons.url : null);
                        return (
                            <a href={page.properties.Website.url} target="_blank" className="card" key={index}>
                                <div className='icons'>
                                    <img src={imageUrl} className="card-image-shadow" alt="图片加载失败" />
                                    <img src={imageUrl} className="card-image" alt="图片加载失败" />
                                </div>
                                <h2 className="card-title">{page.properties.Name.title[0].plain_text}</h2>
                                <div className="card-tags">
                                    {page.properties.Category.select && (
                                        <span className="tag">
                                            {page.properties.Category.select.name}
                                        </span>
                                    )}
                                </div>
                                <p>{page.properties.Description.rich_text[0].plain_text}</p>
                            </a>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

console.log(process.env.NAV_NAME);

export default IndexPage;
