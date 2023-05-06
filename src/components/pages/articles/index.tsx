import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { SEO } from '@/components/blocks/SEO'
import articles from '@/markdown'
import Home from './Home'

const Articles = () => {
  const params = useParams<{ article: string }>()

  const article = useMemo(() => {
    const articleIndex = articles.articles.findIndex(
      ({ attributes }) => attributes.title === decodeURIComponent(params.article!)
    )

    if (articleIndex > -1) {
      const targetArticle = articles.articles[articleIndex]

      return (
        <div key={targetArticle.attributes.title}>
          <SEO
            description={targetArticle.attributes.description}
            title={targetArticle.attributes.title}
            name={targetArticle.attributes.title}
            image={targetArticle.attributes.img}
          />
          <div className="dark:bg-darkBg-400 dark:text-white p-6 markdown-body max-w-5xl mx-auto">
            <div className="border-b mb-5">
              <p className="text-3xl">{targetArticle.attributes.title}</p>
              <div className="flex justify-between">
                <div>작성자: {targetArticle.attributes.author}</div>
                <p>작성날짜: {targetArticle.attributes.created}</p>
              </div>
            </div>
            <targetArticle.ReactComponent />
          </div>
        </div>
      )
    }

    return null
  }, [articles, params])

  return <div>{article ?? <Home />}</div>
}

export default Articles
