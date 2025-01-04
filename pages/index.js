import React, { useEffect, useState } from 'react';
import setResponsivePadding from './js/responsive';

const IndexPage = () => {
    const [databaseContent, setDatabaseContent] = useState([]);
    const [titleName, setTitleName] = useState([]);
    const [uniqueTags, setUniqueTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState(null);

    // 获取数据库内容
    const fetchDatabaseContent = () => {
        fetch('/api/getDatabaseContent')
            .then(response => response.json())
            .then(data => setDatabaseContent(data))
            .catch(error => console.error(error));
    };

    useEffect(() => {
        // 获取唯一标签
        fetch('/api/getUniqueTags')
            .then(response => response.json())
            .then(data => setUniqueTags(data))
            .catch(error => console.error(error));

        // 获取数据库内容
        fetchDatabaseContent();

        // 获取标题名称
        fetch('/api/getTitleName')
            .then(response => response.json())
            .then(data => setTitleName(data))
            .catch(error => console.error(error));
    }, []);

    // 渲染页面内容和使用 `databaseContent` 数据
    return (
        <div style={{ display: 'flex' }}>
            <div style={{ width: '200px', borderRight: '1px solid #ccc' }}>
                {/* 标签栏内容 */}
                <h3>标签栏</h3>
                <ul>
                    {uniqueTags && uniqueTags.map((tag, index) => (
                        <li key={index} onClick={() => setSelectedTag(tag)} style={{ cursor: 'pointer' }}>
                            {tag}
                        </li>
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
                        const pageTag = page.properties.Category.select ? page.properties.Category.select.name : '未分类';

                        // 仅在选中的标签匹配时显示内容
                        if (selectedTag === null || selectedTag === pageTag) {
                            return (
                                <a href={page.properties.Website.url} target="_blank" className="card" key={index}>
                                    <div className='icons'>
                                        <img src={imageUrl} className="card-image-shadow" alt="图片加载失败" />
                                        <img src={imageUrl} className="card-image" alt="图片加载失败" />
                                    </div>
                                    <h2 className="card-title">{page.properties.Name.title[0].plain_text}</h2>
                                    <div className="card-tags">
                                        <span className="tag">{pageTag}</span>
                                    </div>
                                    <p>{page.properties.Description.rich_text[0].plain_text}</p>
                                </a>
                            );
                        }
                        return null; // 不显示不匹配的内容
                    })}
                </div>
            </div>
        </div>
    );
};

console.log(process.env.NAV_NAME);

export default IndexPage;
